import SuspendedUsers from './SuspendedUsers';
import Users from './Users';

export default function RenderArticle({ is }) {
  if (is === 0) {
    return <Users />;
  } else if (is === 1) {
    return <SuspendedUsers />;
  } else if (is === 2) {
  } else if (is === 3) {
  }
}
