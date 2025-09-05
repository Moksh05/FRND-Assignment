const { MaxPriorityQueue } = require("@datastructures-js/priority-queue");

function optimizeCompanyLoads(trucks, loads) {
  loads.sort((a, b) => b - a);

  trucks.forEach((t) => {
    t.assigned = [];
    t.remaining = t.capacity;
  });

  const heap = new MaxPriorityQueue((truck) => truck.remaining);
  trucks.forEach((t) => heap.enqueue(t));

  const unassigned = [];

  for (let load of loads) {
    let bestTruck = heap.dequeue();

    if (bestTruck.remaining >= load) {
      bestTruck.assigned.push(load);
      bestTruck.remaining -= load;
      heap.enqueue(bestTruck);
    } else {
      unassigned.push(load);
      heap.enqueue(bestTruck);
    }
  }

  return { optimizedTrucks: heap.toArray(), unassigned };
}

function optimizeLoads(trucks, totalCost) {
  // group trucks by companyId
  const grouped = trucks.reduce((acc, t) => {
    const cid = t.company.toString();
    if (!acc[cid]) acc[cid] = [];
    acc[cid].push(t);
    return acc;
  }, {});

  const optimizationData = {
    totalCost: Number(totalCost),
    companies: [],
  };

  // Calculate per company
  let globalAssigned = 0;
  const interimResults = {};

  for (const companyId in grouped) {
    const companyTrucks = grouped[companyId];
    const loads = companyTrucks.map((t) => t.assignedLoad);

    const { optimizedTrucks, unassigned } = optimizeCompanyLoads(
      companyTrucks,
      loads
    );

    optimizedTrucks.forEach((t) => {
      t.fullyUtilized = t.remaining === 0;
    });

    const assigned = optimizedTrucks.reduce(
      (sum, t) => sum + (t.capacity - t.remaining),
      0
    );

    const totalCapacity = optimizedTrucks.reduce(
      (sum, t) => sum + t.capacity,
      0
    );

    globalAssigned += assigned;

    interimResults[companyId] = {
      optimizedTrucks,
      unassigned,
      originalTruckCount: companyTrucks.length,
      trucksUsed: optimizedTrucks.filter((t) => t.assigned.length > 0).length,
      totalAssignedLoad: assigned,
      totalCapacity,
    };
  }

  // Distribute costs proportionally
  for (const companyId in interimResults) {
    const stats = interimResults[companyId];
    const cost =
      globalAssigned > 0
        ? (stats.totalAssignedLoad / globalAssigned) * Number(totalCost)
        : 0;

    optimizationData.companies.push({
      company: companyId,
      cost,
      originalTruckCount: stats.originalTruckCount,
      trucksUsed: stats.trucksUsed,
      stats: {
        assigned: stats.totalAssignedLoad,
        capacity: stats.totalCapacity,
        utilization:
          stats.totalCapacity > 0
            ? ((stats.totalAssignedLoad / stats.totalCapacity) * 100).toFixed(
                2
              ) + "%"
            : "0%",
      },
      unassignedLoads: stats.unassigned,
      optimized: stats.optimizedTrucks.map((t) => ({
        truck: t._id,
        assigned: t.assigned,
        remaining: t.remaining,
        fullyUtilized: t.fullyUtilized,
      })),
    });
  }

  return optimizationData;
}

module.exports = { optimizeLoads };
