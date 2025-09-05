function convertOptimizedToCSV(optimization) {
  const rows = [];

  optimization.companies.forEach((company) => {
    company.optimized.forEach((truck) => {
      rows.push({
        company: company.company.name, // populated company name
        truck_id: truck.truck.truckId,
        capacity: truck.truck.capacity,
        assigned_load: truck.truck.assignedLoad,
        assigned: truck.assigned ? truck.assigned.join(";") : "",
        remaining: truck.remaining || 0,
        fullyUtilized: truck.fullyUtilized || false,
        cost: company.cost || 0,
        utilization: company.stats.utilization,
      });
    });
  });

  if (!rows.length) return "";

  const header = Object.keys(rows[0]).join(",") + "\n";
  const csvBody = rows.map((r) => Object.values(r).join(",")).join("\n");
  return header + csvBody;
}

module.exports = { convertOptimizedToCSV };