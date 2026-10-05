import PageShell from "../components/PageShell";

export default function Placeholder({ title }) {
  return <PageShell title={title} crumbs={["Home", title]} />;

}



  