// frontend/src/AdminDashboard.tsx
import { useState, useEffect } from 'react'

interface Order {
  id: number
  customerName: string
  email: string
  phone: string
  eventDate: string
  pickupDate: string
  productType: string
  quantity: string
  customAmount: number | null
  paymentMethod: string
  additionalInfo: string | null
  colorCustomization: boolean
  status: string
  createdAt: string
}

function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://mishti-api.onrender.com/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
      setError('')
    } catch (err) {
      setError('Could not load orders. Make sure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Update order status
  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(
        `https://mishti-api.onrender.com/api/orders/${orderId}/status?status=${newStatus}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (response.ok) {
        // Refresh orders after status update
        fetchOrders()
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  // Load orders on component mount
  useEffect(() => {
    fetchOrders()
  }, [])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b' // Yellow
      case 'confirmed': return '#3b82f6' // Blue
      case 'in-progress': return '#8b5cf6' // Purple
      case 'completed': return '#22c55e' // Green
      case 'cancelled': return '#ef4444' // Red
      default: return '#6b7280' // Gray
    }
  }

  // Get product type display name
  const getProductDisplay = (type: string) => {
    switch (type) {
      case 'narkel': return 'Narkel (Coconut) Narus'
      case 'mango': return 'Mango Burfi'
      case 'ube': return 'Ube Coconut Burfi'
      case 'roohafza': return 'Rooh Afza Coconut Burfi'
      default: return type
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading orders...</h2>
        <p>Please wait while we fetch your orders.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2 style={{ color: '#ef4444' }}>❌ Error</h2>
        <p>{error}</p>
        <button
          onClick={fetchOrders}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#db2777', fontSize: '24px' }}>📋 Order Dashboard</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Manage and track all customer orders</p>
        </div>
        <div>
          <span style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '8px 16px', 
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            Total Orders: {orders.length}
          </span>
          <button
            onClick={fetchOrders}
            style={{
              marginLeft: '10px',
              padding: '8px 16px',
              backgroundColor: '#db2777',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Order List */}
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>No orders yet. Check back soon!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            fontSize: '14px'
          }}>
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>Qty</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>Event Date</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>#{order.id}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 'bold' }}>{order.customerName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{order.email}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{getProductDisplay(order.productType)}</td>
                  <td style={{ padding: '12px' }}>{order.quantity}</td>
                  <td style={{ padding: '12px' }}>{order.eventDate}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                      display: 'inline-block'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        marginLeft: '8px',
                        padding: '6px 10px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80%',
            overflow: 'auto'
          }}>
            <h2 style={{ color: '#db2777', marginBottom: '20px' }}>Order #{selectedOrder.id}</h2>
            <div style={{ marginBottom: '15px' }}>
              <strong>Customer:</strong> {selectedOrder.customerName}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Email:</strong> {selectedOrder.email}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Phone:</strong> {selectedOrder.phone}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Product:</strong> {getProductDisplay(selectedOrder.productType)}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Quantity:</strong> {selectedOrder.quantity}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Event Date:</strong> {selectedOrder.eventDate}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Pickup Date:</strong> {selectedOrder.pickupDate}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Status:</strong>{' '}
              <span style={{
                backgroundColor: getStatusColor(selectedOrder.status),
                color: 'white',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                textTransform: 'capitalize'
              }}>
                {selectedOrder.status}
              </span>
            </div>
            {selectedOrder.additionalInfo && (
              <div style={{ marginBottom: '15px' }}>
                <strong>Notes:</strong> {selectedOrder.additionalInfo}
              </div>
            )}
            <div style={{ marginBottom: '20px', fontSize: '12px', color: '#666' }}>
              <strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#db2777',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;