import { Outlet, useLoaderData } from 'react-router-dom';

export default function AuthLayout() {
  const loaderData = useLoaderData()
  return (
    <div className="container mx-auto py-5">
      <Outlet context={loaderData} />
    </div>
  );
}