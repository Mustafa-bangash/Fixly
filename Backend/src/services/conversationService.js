import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/apperror.js";

/**
 * Create or retrieve a private conversation between a customer
 * and a service provider for a particular repair request.
 */
export async function createOrGetConversation({
  requestId,
  providerId,
  userId,
  role,
}) {
  if (!requestId) {
    throw new AppError("Repair request ID is required", 400);
  }

  if (!userId || !role) {
    throw new AppError("Authentication required", 401);
  }

  if (!["CUSTOMER", "PROVIDER"].includes(role)) {
    throw new AppError("You are not allowed to access conversations", 403);
  }

  const request = await prisma.repairRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      customerId: true,
      status: true,
      categoryId: true,
      job: {
        select: {
          customerId: true,
          providerId: true,
        },
      },
    },
  });

  if (!request) {
    throw new AppError("Repair request not found", 404);
  }

  let targetProviderId;

  if (role === "CUSTOMER") {
    if (request.customerId !== userId) {
      throw new AppError(
        "You can only access conversations for your own repair requests",
        403,
      );
    }

    if (!providerId) {
      throw new AppError("Provider ID is required", 400);
    }

    targetProviderId = providerId;
  } else {
    targetProviderId = userId;

    if (providerId && providerId !== userId) {
      throw new AppError(
        "Providers can only open their own conversations",
        403,
      );
    }
  }

  // Check whether this conversation already exists.
  const existingConversation = await prisma.conversation.findUnique({
    where: {
      requestId_providerId: {
        requestId,
        providerId: targetProviderId,
      },
    },
  });

  if (existingConversation) {
    const isCustomer =
      role === "CUSTOMER" &&
      existingConversation.customerId === userId;

    const isProvider =
      role === "PROVIDER" &&
      existingConversation.providerId === userId;

    if (!isCustomer && !isProvider) {
      throw new AppError(
        "You do not have access to this conversation",
        403,
      );
    }

    // Preserve access to an existing conversation after another
    // provider is booked, so its history is not lost.
    return existingConversation;
  }

  // Do not create new conversations with other providers after booking.
  if (
    request.job &&
    request.job.providerId !== targetProviderId
  ) {
    throw new AppError(
      "This repair request has already been assigned to another provider",
      403,
    );
  }

  if (request.status !== "OPEN") {
    throw new AppError(
      "New conversations can only be opened for open repair requests",
      403,
    );
  }

  // Only providers notified about the request or providers who
  // submitted a bid can start a conversation about it.
  const [broadcast, bid] = await Promise.all([
    prisma.requestBroadcast.findUnique({
      where: {
        requestId_providerId: {
          requestId,
          providerId: targetProviderId,
        },
      },
      select: { id: true },
    }),
    prisma.bid.findFirst({
      where: {
        requestId,
        providerId: targetProviderId,
      },
      select: { id: true },
    }),
  ]);

  if (!broadcast && !bid) {
    throw new AppError(
      "This provider has not been invited to or bid on this repair request",
      403,
    );
  }

  // Confirm that the provider profile exists.
  const provider = await prisma.providerProfile.findUnique({
    where: { userId: targetProviderId },
    select: { userId: true },
  });

  if (!provider) {
    throw new AppError("Service provider not found", 404);
  }

  return prisma.conversation.upsert({
    where: {
      requestId_providerId: {
        requestId,
        providerId: targetProviderId,
      },
    },
    create: {
      requestId,
      customerId: request.customerId,
      providerId: targetProviderId,
    },
    update: {},
  });
}

/**
 * List conversations belonging to the authenticated customer
 * or provider.
 */
export async function listMyConversations({ userId, role }) {
  if (!userId || !role) {
    throw new AppError("Authentication required", 401);
  }

  if (role === "CUSTOMER") {
    return prisma.conversation.findMany({
      where: {
        customerId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        request: {
          select: {
            id: true,
            description: true,
            status: true,
          },
        },
        provider: {
          select: {
            userId: true,
            user: {
              select: {
                fullName: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            sentAt: "desc",
          },
          select: {
            id: true,
            content: true,
            senderId: true,
            sentAt: true,
          },
        },
      },
    });
  }

  if (role === "PROVIDER") {
    return prisma.conversation.findMany({
      where: {
        providerId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        request: {
          select: {
            id: true,
            description: true,
            status: true,
          },
        },
        customer: {
          select: {
            id: true,
            fullName: true,
            profilePhotoUrl: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            sentAt: "desc",
          },
          select: {
            id: true,
            content: true,
            senderId: true,
            sentAt: true,
          },
        },
      },
    });
  }

  throw new AppError("You are not allowed to access conversations", 403);
}

/**
 * Verify that the authenticated user is a participant in a conversation.
 */
export async function getAccessibleConversation({
  conversationId,
  userId,
  role,
}) {
  if (!conversationId) {
    throw new AppError("Conversation ID is required", 400);
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      request: {
        select: {
          id: true,
          status: true,
          job: {
            select: {
              providerId: true,
              customerId: true,
            },
          },
        },
      },
    },
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  const isCustomer =
    role === "CUSTOMER" && conversation.customerId === userId;

  const isProvider =
    role === "PROVIDER" && conversation.providerId === userId;

  if (!isCustomer && !isProvider) {
    throw new AppError(
      "You do not have access to this conversation",
      403,
    );
  }

  return conversation;
}

/**
 * Determine whether a participant can send a new message.
 * A locked conversation is read-only.
 */
export async function assertCanSendMessage({
  conversation,
  userId,
  role,
}) {
  if (conversation.status !== "OPEN") {
    throw new AppError("This conversation is locked", 403);
  }

  const isCustomer =
    role === "CUSTOMER" && conversation.customerId === userId;

  const isProvider =
    role === "PROVIDER" && conversation.providerId === userId;

  if (!isCustomer && !isProvider) {
    throw new AppError(
      "You do not have permission to send messages here",
      403,
    );
  }

  const job = await prisma.job.findUnique({
    where: {
      requestId: conversation.requestId,
    },
    select: {
      customerId: true,
      providerId: true,
    },
  });

    if (job) {
        const isBookedConversation =
            conversation.customerId === job.customerId &&
            conversation.providerId === job.providerId;

        const isBookedCustomer =
            role === "CUSTOMER" &&
            userId === job.customerId &&
            isBookedConversation;

        const isBookedProvider =
            role === "PROVIDER" &&
            userId === job.providerId &&
            isBookedConversation;

        if (!isBookedCustomer && !isBookedProvider) {
            throw new AppError(
            "Only the customer and booked provider can send messages after a bid is accepted",
            403,
            );
        }
    }



  return true;
}