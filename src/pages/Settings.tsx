import Logout from "../components/Logout";

export default function Settings() {
  return (
     <section
      className="container d-flex justify-content-center flex-column "
      style={{ height: "100vh" }}
    >
      <div
        className="container row m-auto"
        style={{ width: "85%", height: "60%" }}
      >
      <button className="btn btn-primary">
        <span>Logout</span>
        <Logout />
      </button>
    </div>
  </section>
  );
}
