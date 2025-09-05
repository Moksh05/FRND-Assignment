// utils/optimizer.js

const { MaxPriorityQueue } = require("@datastructures-js/priority-queue");

let optimizedResult = null;

function groupByCompany(trucks) {
  return trucks.reduce((acc, truck) => {
    if (!acc[truck.company]) acc[truck.company] = [];
    acc[truck.company].push(truck);
    return acc;
  }, {});
}

function collectLoads(companyTrucks) {
  return companyTrucks.map((t) => t.assigned_load);
}

function optimizeCompanyLoads(trucks, loads) {
  // Sort trucks by capacity descending
  loads.sort((a, b) => b - a);

  // Reset truck allocations
  trucks.forEach((t) => {
    t.assigned = [];
    t.remaining = t.capacity;
  });

  // Build max-heap by remaining capacity
  const heap = new MaxPriorityQueue((truck) => truck.remaining);
  trucks.forEach((t) => heap.enqueue(t));

  const unassigned = [];

  for (let load of loads) {
    let bestTruck = heap.dequeue(); // O(log T)

    if (bestTruck.remaining >= load) {
      bestTruck.assigned.push(load);
      bestTruck.remaining -= load;
      heap.enqueue(bestTruck); // put back updated
    } else {
      unassigned.push(load);
      heap.enqueue(bestTruck); // still put it back
    }
  }

  return { optimizedTrucks: heap.toArray(), unassigned };
}

function calculateCost(companiesResult, totalCost) {
  // Find total assigned across all companies
  const totalAssigned = Object.values(companiesResult).reduce(
    (sum, c) => sum + c.stats.assigned,
    0
  );

  for (let company in companiesResult) {
    const assigned = companiesResult[company].stats.assigned;
    companiesResult[company].cost =
      totalAssigned > 0 ? (assigned / totalAssigned) * totalCost : 0;
  }

  return companiesResult;
}

exports.optimizeLoads = (trucks, totalCost) => {
  const grouped = groupByCompany(trucks);
  const result = {};

  for (let company in grouped) {
    const originalTruckCount = grouped[company].length;
    const loads = collectLoads(grouped[company]);
    const { optimizedTrucks, unassigned } = optimizeCompanyLoads(
      grouped[company],
      loads
    );
    optimizedTrucks.forEach((t) => {
      t.fullyUtilized = t.remaining === 0;
    });

    const assigned = optimizedTrucks.reduce(
      (sum, t) => sum + (t.capacity - t.remaining),
      0
    );
    const capacity = optimizedTrucks.reduce((sum, t) => sum + t.capacity, 0);
    const utilization = capacity > 0 ? (assigned / capacity) * 100 : 0;
    const trucksUsed = optimizedTrucks.filter(
      (t) => t.assigned.length > 0
    ).length;
    result[company] = {
      optimized: optimizedTrucks,
      unassignedLoads: unassigned,
      originalTruckCount,
      trucksUsed,
      stats: { assigned, capacity, utilization: utilization.toFixed(2) + "%" },
    };
  }

  return calculateCost(result, totalCost);
};

exports.setOptimizedResult=(data)=>{
  optimizedResult = data;
};
exports.getOptimizedResult =()=>optimizedResult


