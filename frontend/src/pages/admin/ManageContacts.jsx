// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { getContacts, deleteContact } from "../../services/admin";
// import Spinner from "../../components/common/Spinner";

// export default function ManageContacts() {

//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);


//   const load = () => {
//     getContacts()
//       .then(res => {
//         setContacts(res.data.contacts || []);
//       })
//       .finally(() => setLoading(false));
//   };


//   useEffect(() => {
//     load();
//   }, []);


//   const remove = async (id) => {

//     if (!confirm("Delete this message?"))
//       return;

//     try {

//       await deleteContact(id);

//       toast.success("Message deleted");

//       load();

//     } catch {
//       toast.error("Delete failed");
//     }
//   };


//   if (loading)
//     return <Spinner fullPage />;


//   return (
//     <div>

//       <h4 className="fw-bold mb-4">
//         Contact Messages ({contacts.length})
//       </h4>


//       <div className="table-responsive">

//         <table className="table table-hover">

//           <thead>

//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Message</th>
//               <th>Date</th>
//               <th>Action</th>
//             </tr>

//           </thead>


//           <tbody>

//           {
//             contacts.map(c => (

//               <tr key={c._id}>

//                 <td>{c.name}</td>

//                 <td>{c.email}</td>


//                 <td style={{
//                   maxWidth: 300
//                 }}>
//                   {c.message}
//                 </td>


//                 <td>
//                   {
//                     c.created_at
//                     ?
//                     new Date(c.created_at)
//                     .toLocaleDateString("en-IN")
//                     :
//                     "-"
//                   }
//                 </td>


//                 <td>

//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => remove(c._id)}
//                   >
//                     Delete
//                   </button>

//                 </td>

//               </tr>

//             ))
//           }

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getContacts, deleteContact } from "../../services/admin";
import { getErrorMessage } from "../../utils/errorHandler";
import Spinner from "../../components/common/Spinner";

export default function ManageContacts() {

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);


  const load = () => {

    setLoading(true);
    setError(null);

    getContacts()

      .then((res) => {

        setContacts(res.data.contacts || []);

      })

      .catch((error) => {

        console.error("Failed to fetch contacts:", error);

        setError(getErrorMessage(error));

      })

      .finally(() => {

        setLoading(false);

      });

  };


  useEffect(() => {

    load();

  }, []);


  const remove = async (id) => {

    if (!window.confirm("Delete this message?")) {
      return;
    }


    try {

      setProcessing(true);

      await deleteContact(id);

      toast.success("Message deleted successfully");

      load();

    } catch (error) {

      console.error("Delete contact failed:", error);

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
        Contact Messages ({contacts.length})
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
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>

          </thead>


          <tbody>

            {contacts.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-4 text-muted"
                >
                  No contact messages found.
                </td>

              </tr>

            ) : (

              contacts.map((contact) => (

                <tr key={contact._id}>

                  <td>
                    {contact.name}
                  </td>


                  <td>
                    {contact.email}
                  </td>


                  <td
                    style={{
                      maxWidth: 300,
                      wordBreak: "break-word"
                    }}
                  >
                    {contact.message}
                  </td>


                  <td className="small text-muted">

                    {contact.created_at
                      ? new Date(contact.created_at)
                          .toLocaleDateString("en-IN")
                      : "—"}

                  </td>


                  <td>

                    <button
                      className="btn btn-sm btn-danger"
                      disabled={processing}
                      onClick={() => remove(contact._id)}
                    >

                      {processing
                        ? "Deleting..."
                        : "Delete"}

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}