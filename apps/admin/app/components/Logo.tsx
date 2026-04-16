const Logo: React.FC = () => {
  return (
    <div className="relative h-8 w-8">
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6366f1] via-[#a855f7] to-[#38bdf8]"
        style={{ animation: 'logo-orbit 6s linear infinite' }}
      />
      <div
        className="absolute inset-[3px] rounded-full bg-[#020617]"
        style={{ boxShadow: '0 0 12px rgba(99,102,241,0.9)' }}
      />
      <div
        className="absolute inset-[9px] rounded-full bg-[#6366f1]"
        style={{ animation: 'logo-pulse 2.2s ease-in-out infinite' }}
      />
    </div>
  );
};

export default Logo;
