// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { getUsers, updateUserRole } from "../../services/admin";
// import Spinner from "../../components/common/Spinner";
// import Pagination from "../../components/common/Pagination";

// export default function ManageUsers() {
//   const [users, setUsers] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);

//   const load = p => {
//     setLoading(true);
//     getUsers(p).then(r => { setUsers(r.data.users); setTotal(r.data.total); }).finally(() => setLoading(false));
//   };

//   useEffect(() => { load(page); }, [page]);

//   const toggleRole = async (user) => {
//     const newRole = user.role === "admin" ? "student" : "admin";
//     if (!confirm(`Make ${user.name} a ${newRole}?`)) return;
//     try {
//       await updateUserRole(user._id, newRole);
//       toast.success("Role updated");
//       load(page);
//     } catch { toast.error("Failed"); }
//   };

//   if (loading) return <Spinner fullPage />;

//   return (
//     <div>
//       <h4 className="fw-bold mb-4">Manage Users ({total})</h4>
//       <div className="table-responsive">
//         <table className="table table-hover align-middle">
//           <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
//           <tbody>
//             {users.map(u => (
//               <tr key={u._id}>
//                 <td className="d-flex align-items-center gap-2">
//                   {u.profile_picture && <img src={u.profile_picture} width={32} height={32} className="rounded-circle" alt="" />}
//                   <span className="fw-medium">{u.name}</span>
//                 </td>
//                 <td className="small">{u.email}</td>
//                 <td>
//                   <span className={`badge ${u.role === "admin" ? "bg-danger" : "bg-primary"}`}>
//                     {u.role}
//                   </span>
//                 </td>
//                 <td className="small text-muted">
//                   {u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN") : "—"}
//                 </td>
//                 <td>
//                   <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleRole(u)}>
//                     {u.role === "admin" ? "Demote" : "Make Admin"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Pagination page={page} total={total} perPage={20} onChange={setPage} />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUsers, updateUserRole } from "../../services/admin";
import { getErrorMessage } from "../../utils/errorHandler";
import Spinner from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";

export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState(null);


  const load = (currentPage) => {

    setLoading(true);
    setError(null);

    getUsers(currentPage)

      .then((res) => {

        setUsers(res.data.users || []);
        setTotal(res.data.total || 0);

      })

      .catch((error) => {

        console.error("Failed to load users:", error);

        setError(getErrorMessage(error));

      })

      .finally(() => {

        setLoading(false);

      });

  };


  useEffect(() => {

    load(page);

  }, [page]);


  const toggleRole = async (user) => {

    const newRole =
      user.role === "admin"
        ? "student"
        : "admin";


    if (!window.confirm(
      `Make ${user.name} a ${newRole}?`
    )) {
      return;
    }


    try {

      setProcessing(true);


      await updateUserRole(
        user._id,
        newRole
      );


      toast.success("Role updated successfully");


      load(page);


    } catch (error) {

      console.error("Role update failed:", error);

      toast.error(getErrorMessage(error));

    } finally {

      setProcessing(false);

    }

  };


  if (loading) {
    return <Spinner fullPage />;
  }


  return (

    <div>

      <h4 className="fw-bold mb-4">
        Manage Users ({total})
      </h4>


      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      <div className="table-responsive">

        <table className="table table-hover align-middle">

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>

          </thead>


          <tbody>

            {users.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center text-muted py-4"
                >
                  No users found.
                </td>

              </tr>

            ) : (

              users.map((user) => (

                <tr key={user._id}>

                  <td className="d-flex align-items-center gap-2">

                    {user.profile_picture && (

                      <img
                        src={user.profile_picture}
                        width={32}
                        height={32}
                        className="rounded-circle"
                        alt={user.name}
                      />

                    )}

                    <span className="fw-medium">
                      {user.name}
                    </span>

                  </td>


                  <td className="small">
                    {user.email}
                  </td>


                  <td>

                    <span
                      className={
                        `badge ${
                          user.role === "admin"
                            ? "bg-danger"
                            : "bg-primary"
                        }`
                      }
                    >
                      {user.role}
                    </span>

                  </td>


                  <td className="small text-muted">

                    {user.created_at
                      ? new Date(
                          user.created_at
                        ).toLocaleDateString("en-IN")
                      : "—"}

                  </td>


                  <td>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={processing}
                      onClick={() =>
                        toggleRole(user)
                      }
                    >

                      {processing
                        ? "Updating..."
                        : user.role === "admin"
                          ? "Demote"
                          : "Make Admin"}

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      <Pagination
        page={page}
        total={total}
        perPage={20}
        onChange={setPage}
      />

    </div>

  );

}