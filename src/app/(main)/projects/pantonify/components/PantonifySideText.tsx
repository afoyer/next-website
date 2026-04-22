// GSAP targets this element by class (.pantonify-side-text) — no ref needed.
const PantonifySideText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`pantonify-side-text${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
};

export default PantonifySideText;
