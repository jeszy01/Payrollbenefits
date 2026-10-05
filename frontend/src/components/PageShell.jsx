import Topbar from "./Topbar";

export default function PageShell({ title, subtitle, crumbs, actions, children }) {
  return (
    <>
      <Topbar title={title} crumbs={crumbs} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-1 max-w-md text-sm text-slate-500">{subtitle}</p>}
          </div>
          <div className="flex gap-3">{actions}</div>
        </div>
        <div className="mt-6">{children}</div>
      </main>
    </>
  );
}
