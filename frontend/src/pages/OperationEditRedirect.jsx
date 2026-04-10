import { Navigate, useParams, useSearchParams } from 'react-router-dom';

/** Old /operations/edit/:id links → /operations?edit=:id (side panel). */
export default function OperationEditRedirect() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams(searchParams);
  next.set('edit', id);
  return <Navigate to={`/operations?${next.toString()}`} replace />;
}
