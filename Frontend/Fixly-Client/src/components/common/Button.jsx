const variants = {
  primary: 'border-brand bg-brand text-white',
  secondary: 'border-line bg-transparent text-navy',
};
// two looks for the button, primary is filled blue and secondary only has an outline
// className lets the place that uses the button add its own extra classes like padding
export default function Button({ href, variant = 'primary', className = '', children }) {
  return (
    <a
      href={href}
      className={`mt-[14px] inline-block min-h-[56px] rounded-[10px] border-2 py-[14px] text-center text-[18px] font-semibold leading-[normal] ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
