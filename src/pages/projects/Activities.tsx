import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Badge, Spinner } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import type { IssueResponse } from "../../types/IssueTypes";
import NoContent from "../../components/NoContent";

// Register Chart.js components & plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Activities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<IssueResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:8080/task/all/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data: IssueResponse[] = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

  // Count tasks by status
  const counts = {
    todo: tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    review: tasks.filter((t) => t.status === "AWAIT_APPROVAL").length,
    done: tasks.filter((t) => t.status === "COMPLETED").length,
    incomplete: tasks.filter((t) => t.status === "INCOMPLETE").length,
  };

  // Chart Data
  const data = {
    labels: ["To Do", "In Progress", "Review", "Done"],
    datasets: [
      {
        label: "Tasks",
        data: [counts.todo, counts.inProgress, counts.review, counts.done],
        backgroundColor: ["#dc3545", "#ffc107", "#0dcaf0", "#198754"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
  responsive: true,
  layout: {
    padding: 30, 
  },
  plugins: {
    legend: { display: false },
    datalabels: {
      color: "#000",
      formatter: (value: number, ctx: any) => {
        let sum = ctx.chart.data.datasets[0].data.reduce(
          (a: number, b: number) => a + b,
          0
        );
        if (sum === 0) return "0%";
        let percentage = ((value * 100) / sum).toFixed(1) + "%";
        return percentage;
      },
      anchor: "end", 
      align: "end",  
      font: { weight: "bold" },
 
    },
  },
};


  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading...</span>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 bg-light" fluid>
      <h2 className="text-center mb-4">Activities</h2>

      {/* Chart + 6 Boxes Section */}
      {tasks.length===0 && <NoContent/>}
      {tasks.length!==0 &&
      <Row className="mb-5">
        {/* Pie Chart (Left) */}
        
        
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <div style={{ maxWidth: "280px" }}>
              <Pie data={data} options={options} />
          </div>
        </Col>
        
        <Col md={6}>
          <Row className="mb-3">
            <Col md={6}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="mb-2 text-danger">To Do</h6>
                  <h3>{counts.todo}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="mb-2 text-warning">In Progress</h6>
                  <h3>{counts.inProgress}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="mb-2 text-info">Review</h6>
                  <h3>{counts.review}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="mb-2 text-success">Done</h6>
                  <h3>{counts.done}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="mb-2 text-muted">Box Five</h6>
                  <h3>-</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="mb-2 text-danger">Incomplete</h6>
                  <h3>{counts.incomplete}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>}

      {/* History Table */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Task History</Card.Title>
          <Table striped hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Task</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => {
                const date = new Date(task.createdAt);
                const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                return (
                  <tr key={task.id}>
                    <td>{idx + 1}</td>
                    <td>{task.title}</td>
                    <td>
                      <Badge bg={
                        task.status === "COMPLETED" ? "success" :
                        task.status === "IN_PROGRESS" ? "warning" :
                        task.status === "AWAIT_APPROVAL" ? "info" :
                        task.status === "INCOMPLETE" ? "danger" : "secondary"
                      }>
                        {task.status}
                      </Badge>
                    </td>
                    <td>{formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Activities;
