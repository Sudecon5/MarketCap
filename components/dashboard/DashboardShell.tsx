export default function DashboardShell({
  left,
  center,
  right,
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div
      className="max-w-[1800px] mx-auto w-full grid grid-cols-1 gap-5
                 lg:grid-cols-[22%_1fr_24%] xl:grid-cols-[20%_1fr_22%]"
    >
      {/* Left sidebar — hidden on mobile/tablet, shown as a top block on md, full column on lg+ */}
      <div className="hidden lg:block">{left}</div>

      {/* Center — always visible, always first on mobile */}
      <div className="order-first lg:order-none min-w-0">{center}</div>

      {/* Right sidebar (Research) — collapses to a non-sticky block below center on mobile */}
      <div className="lg:block">{right}</div>

      {/* Mobile-only: left sidebar content shown below center, non-sticky */}
      <div className="lg:hidden order-last">{left}</div>
    </div>
  );
}
