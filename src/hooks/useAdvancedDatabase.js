import { useState, useEffect } from 'react';
import {
  // Notifications
  getAllNotifications,
  getUnreadNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  // Rooms
  getAllRooms,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  // Prescriptions
  getAllPrescriptions,
  getPrescriptionsByPatientId,
  getActivePrescriptions,
  createPrescription,
  updatePrescription,
  // Invoices
  getAllInvoices,
  getInvoicesByPatientId,
  createInvoice,
  updateInvoice,
  getInvoiceItems,
  addInvoiceItem,
  // Pharmacy
  getAllPharmacyItems,
  getLowStockItems,
  getExpiringMedications,
  createPharmacyItem,
  updatePharmacyItem,
  // Emergency
  getAllEmergencyCases,
  getActiveEmergencyCases,
  createEmergencyCase,
  updateEmergencyCase,
  // Surgery
  getAllSurgeries,
  getUpcomingSurgeries,
  createSurgery,
  updateSurgery,
  // Imaging
  getAllImagingTests,
  getPendingImagingTests,
  createImagingTest,
  updateImagingTest,
  // Shifts
  getAllShifts,
  getShiftsByUserId,
  getTodayShifts,
  createShift,
  updateShift,
  deleteShift,
  // Vaccinations
  getAllVaccinations,
  createVaccination,
  // Referrals
  getAllReferrals,
  createReferral,
  updateReferral,
  // Incidents
  getAllIncidentReports,
  createIncidentReport,
  updateIncidentReport,
  // Blood Bank
  getBloodInventory,
  createBloodUnit,
  // Equipment
  getAllEquipment,
  createEquipment,
  updateEquipment,
  // Meals
  getAllMealOrders,
  getTodayMealOrders,
  createMealOrder,
  updateMealOrder
} from '../services/database';

// Notifications Hook
export function useNotifications(userId = null) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = userId ? await getAllNotifications(userId) : await getAllNotifications();
      setNotifications(data);
      const unread = data.filter(n => n.is_read === 0);
      setUnreadCount(unread.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const addNotification = async (notification) => {
    await createNotification(notification);
    await loadNotifications();
  };

  const markAsRead = async (id) => {
    await markNotificationAsRead(id);
    await loadNotifications();
  };

  const markAllAsRead = async () => {
    if (userId) {
      await markAllNotificationsAsRead(userId);
      await loadNotifications();
    }
  };

  const removeNotification = async (id) => {
    await deleteNotification(id);
    await loadNotifications();
  };

  return { notifications, unreadCount, loading, addNotification, markAsRead, markAllAsRead, removeNotification, refresh: loadNotifications };
}

// Rooms Hook
export function useRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const addRoom = async (room) => {
    await createRoom(room);
    await loadRooms();
  };

  const editRoom = async (id, room) => {
    await updateRoom(id, room);
    await loadRooms();
  };

  const removeRoom = async (id) => {
    await deleteRoom(id);
    await loadRooms();
  };

  return { rooms, loading, addRoom, editRoom, removeRoom, refresh: loadRooms };
}

// Prescriptions Hook
export function usePrescriptions(patientId = null) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = patientId ? await getPrescriptionsByPatientId(patientId) : await getAllPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, [patientId]);

  const addPrescription = async (prescription) => {
    await createPrescription(prescription);
    await loadPrescriptions();
  };

  const editPrescription = async (id, prescription) => {
    await updatePrescription(id, prescription);
    await loadPrescriptions();
  };

  return { prescriptions, loading, addPrescription, editPrescription, refresh: loadPrescriptions };
}

// Invoices Hook
export function useInvoices(patientId = null) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = patientId ? await getInvoicesByPatientId(patientId) : await getAllInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [patientId]);

  const addInvoice = async (invoice) => {
    await createInvoice(invoice);
    await loadInvoices();
  };

  const editInvoice = async (id, invoice) => {
    await updateInvoice(id, invoice);
    await loadInvoices();
  };

  return { invoices, loading, addInvoice, editInvoice, refresh: loadInvoices };
}

// Pharmacy Hook
export function usePharmacy() {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPharmacy = async () => {
    try {
      setLoading(true);
      const [inventoryData, lowStockData, expiringData] = await Promise.all([
        getAllPharmacyItems(),
        getLowStockItems(),
        getExpiringMedications(30)
      ]);
      setInventory(inventoryData);
      setLowStock(lowStockData);
      setExpiring(expiringData);
    } catch (error) {
      console.error('Error loading pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacy();
  }, []);

  const addItem = async (item) => {
    await createPharmacyItem(item);
    await loadPharmacy();
  };

  const editItem = async (id, item) => {
    await updatePharmacyItem(id, item);
    await loadPharmacy();
  };

  const removeItem = async (id) => {
    // Placeholder for delete functionality
    console.log('Delete item:', id);
    await loadPharmacy();
  };

  return { 
    inventory, 
    lowStockItems: lowStock, 
    expiringItems: expiring, 
    loading, 
    createItem: addItem, 
    updateItem: editItem, 
    deleteItem: removeItem,
    refresh: loadPharmacy 
  };
}

// Emergency Hook
export function useEmergency() {
  const [cases, setCases] = useState([]);
  const [activeCases, setActiveCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEmergency = async () => {
    try {
      setLoading(true);
      const [allData, activeData] = await Promise.all([
        getAllEmergencyCases(),
        getActiveEmergencyCases()
      ]);
      setCases(allData);
      setActiveCases(activeData);
    } catch (error) {
      console.error('Error loading emergency data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergency();
  }, []);

  const addCase = async (emergencyCase) => {
    await createEmergencyCase(emergencyCase);
    await loadEmergency();
  };

  const editCase = async (id, emergencyCase) => {
    await updateEmergencyCase(id, emergencyCase);
    await loadEmergency();
  };

  return { cases, activeCases, loading, addCase, editCase, refresh: loadEmergency };
}

// Surgery Hook
export function useSurgeries() {
  const [surgeries, setSurgeries] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSurgeries = async () => {
    try {
      setLoading(true);
      const [allData, upcomingData] = await Promise.all([
        getAllSurgeries(),
        getUpcomingSurgeries()
      ]);
      setSurgeries(allData);
      setUpcoming(upcomingData);
    } catch (error) {
      console.error('Error loading surgeries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurgeries();
  }, []);

  const addSurgery = async (surgery) => {
    await createSurgery(surgery);
    await loadSurgeries();
  };

  const editSurgery = async (id, surgery) => {
    await updateSurgery(id, surgery);
    await loadSurgeries();
  };

  return { surgeries, upcoming, loading, addSurgery, editSurgery, refresh: loadSurgeries };
}

// Imaging Hook
export function useImaging() {
  const [tests, setTests] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadImaging = async () => {
    try {
      setLoading(true);
      const [allData, pendingData] = await Promise.all([
        getAllImagingTests(),
        getPendingImagingTests()
      ]);
      setTests(allData);
      setPending(pendingData);
    } catch (error) {
      console.error('Error loading imaging tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImaging();
  }, []);

  const addTest = async (test) => {
    await createImagingTest(test);
    await loadImaging();
  };

  const editTest = async (id, test) => {
    await updateImagingTest(id, test);
    await loadImaging();
  };

  return { tests, pending, loading, addTest, editTest, refresh: loadImaging };
}

// Shifts Hook
export function useShifts(userId = null) {
  const [shifts, setShifts] = useState([]);
  const [todayShifts, setTodayShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const allData = userId ? await getShiftsByUserId(userId) : await getAllShifts();
      const todayData = await getTodayShifts();
      setShifts(allData);
      setTodayShifts(todayData);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShifts();
  }, [userId]);

  const addShift = async (shift) => {
    await createShift(shift);
    await loadShifts();
  };

  const editShift = async (id, shift) => {
    await updateShift(id, shift);
    await loadShifts();
  };

  const removeShift = async (id) => {
    await deleteShift(id);
    await loadShifts();
  };

  return { shifts, todayShifts, loading, addShift, editShift, removeShift, refresh: loadShifts };
}

// Simplified hooks for other modules
export function useVaccinations(patientId = null) {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllVaccinations(patientId);
        setVaccinations(data);
      } catch (error) {
        console.error('Error loading vaccinations:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const addVaccination = async (vaccination) => {
    await createVaccination(vaccination);
    const data = await getAllVaccinations(patientId);
    setVaccinations(data);
  };

  return { vaccinations, loading, addVaccination };
}

export function useReferrals(patientId = null) {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllReferrals(patientId);
        setReferrals(data);
      } catch (error) {
        console.error('Error loading referrals:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const addReferral = async (referral) => {
    await createReferral(referral);
    const data = await getAllReferrals(patientId);
    setReferrals(data);
  };

  const editReferral = async (id, referral) => {
    await updateReferral(id, referral);
    const data = await getAllReferrals(patientId);
    setReferrals(data);
  };

  return { referrals, loading, addReferral, editReferral };
}

export function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllIncidentReports();
        setIncidents(data);
      } catch (error) {
        console.error('Error loading incidents:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addIncident = async (incident) => {
    await createIncidentReport(incident);
    const data = await getAllIncidentReports();
    setIncidents(data);
  };

  const editIncident = async (id, incident) => {
    await updateIncidentReport(id, incident);
    const data = await getAllIncidentReports();
    setIncidents(data);
  };

  return { incidents, loading, addIncident, editIncident };
}

export function useBloodBank() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getBloodInventory();
        setInventory(data);
      } catch (error) {
        console.error('Error loading blood inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addBloodUnit = async (unit) => {
    await createBloodUnit(unit);
    const data = await getBloodInventory();
    setInventory(data);
  };

  return { inventory, loading, addBloodUnit };
}

export function useEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllEquipment();
        setEquipment(data);
      } catch (error) {
        console.error('Error loading equipment:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addEquipment = async (item) => {
    await createEquipment(item);
    const data = await getAllEquipment();
    setEquipment(data);
  };

  const editEquipment = async (id, item) => {
    await updateEquipment(id, item);
    const data = await getAllEquipment();
    setEquipment(data);
  };

  return { equipment, loading, addEquipment, editEquipment };
}

export function useMealOrders(patientId = null) {
  const [orders, setOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const allData = await getAllMealOrders(patientId);
        const todayData = await getTodayMealOrders();
        setOrders(allData);
        setTodayOrders(todayData);
      } catch (error) {
        console.error('Error loading meal orders:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const addOrder = async (order) => {
    await createMealOrder(order);
    const data = await getAllMealOrders(patientId);
    setOrders(data);
  };

  const editOrder = async (id, order) => {
    await updateMealOrder(id, order);
    const data = await getAllMealOrders(patientId);
    setOrders(data);
  };

  return { orders, todayOrders, loading, addOrder, editOrder };
}
