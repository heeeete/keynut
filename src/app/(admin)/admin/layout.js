import Header from './_components/Header';
import Nav from './_components/Nav';

export default function AdminLayout({ children }) {
  return (
    <div className="">
      <Header />
      <div className="flex pt-10">
        <Nav />
        <div className="flex w-full pl-72">{children}</div>
      </div>
    </div>
  );
}
