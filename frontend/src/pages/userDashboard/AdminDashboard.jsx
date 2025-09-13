import React, { useState,useEffect, use } from "react";
import "./AdminDashboard.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function AdminDashboard() {
  const [activesubs, setActiveSubs] = useState("");
  const [cancelledsubs, setCancelledSubs] = useState("");
  const [popularplan, setPopularPlan] = useState("");
  const graphdata = [
    { month: "Jan", Active: 1200, Cancelled: 80 },
    { month: "Feb", Active: 1350, Cancelled: 95 },
    { month: "Mar", Active: 1420, Cancelled: 100 },
    { month: "Apr", Active: 1500, Cancelled: 120 },
    { month: "May", Active: 1700, Cancelled: 90 },
  ];
  /*const [graphData, setGraphData] = useState([]);
  
  /*useEffect(() => {
    axios.get("").then((response) => {
      setActiveSubs(response.data.activeSubscriptions);
      setCancelledSubs(response.data.cancelledSubscriptions);
      setPopularPlan(response.data.mostPopularPlan);
    });
    */

  
  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2 className="logo">SMS Admin</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li >Manage Plans</li>
            <li>Manage Discounts</li>
            <li>Analytics</li>
            <li>User Activity</li>
            <li>Notifications</li>
          </ul>
          <button> logout</button>        
        </nav>
      </aside>

      <main className="main-content">
      
        <header className="header">
          <h1>Admin Dashboard</h1>
          <div className="admin-profile">👤 Admin</div>
        </header>

        <section className="cards">
          <div className="card">
            <h3>Active Subscriptions</h3>
            {/*{activesubs && <p>{activesubs}</p>}*/}
          </div>
          <div className="card">
            <h3>Cancelled (This Month)</h3>
            
            {/*{cancelledsubs && <p>{cancelledsubs}</p>}*/}
          </div>
          <div className="card">
            <h3>Most Popular Plan</h3>
            <p>Fibernet 100 Mbps</p>
            {/*{popularplan && <p>{popularplan}</p>}*/}
          </div>
        </section>

        <section className="plans">
          <h2>Manage Plans</h2>
          <table>
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Price</th>
                <th>Quota</th>
                <th>Duration months</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fibernet 50 Mbps</td>
                <td>$20</td>
                <td>500 GB</td>
                <td>Active</td>
                <td>
                  <button >Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
              <tr>
                <td>Copper Broadband</td>
                <td>$15</td>
                <td>300 GB</td>
                <td>Active</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="discounts">
          <h2>Manage Discounts</h2>
          <table>
            <thead>
              <tr>
                <th>Discount Name</th>
                <th>Percentage</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Summer Offer</td>
                <td>20%</td>
                <td>Valid till June</td>
                <td><span className="status-active">Active</span></td>
                <td>
                  <button>Deactivate</button>
                  <button>Delete</button>
                </td>
              </tr>
              <tr>
                <td>New User Offer</td>
                <td>15%</td>
                <td>First Month Only</td>
                <td><span className="status-inactive">Inactive</span></td>
                <td>
                  <button>Activate</button>
                  <button>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>


        <section className="analytics">
          <h2>Analytics</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphdata} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Active" fill="#00adb5" />
                <Bar dataKey="Cancelled" fill="#ff6b6b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
