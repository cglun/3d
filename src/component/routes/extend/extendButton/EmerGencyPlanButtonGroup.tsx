export default function EmerGencyPlanButtonGroup() {
  // const emergencyPlan = scene?.getObjectByName(GROUP.EMERGENCY_PLAN);

  return (
    <div
      style={{
        height: "60%",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#888",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        position: "absolute",
        top: "10%",
        left: "6%",
        cursor: "not-allowed",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginRight: "20px",
        }}
      >
        <button>应急计划</button>
        <button>应急计划</button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginRight: "20px",
        }}
      >
        <button>应急计划</button>
        <button>应急计划</button>
      </div>
      {/* {emergencyPlan?.children &&
        emergencyPlan?.children.map((item) => {
          return <button key={item.name}>{item.name}</button>;
        })} */}
    </div>
  );
}
