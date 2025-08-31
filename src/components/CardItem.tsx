import { Draggable } from "@hello-pangea/dnd";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  priority: "CRITICAL" | "MEDIUM" | "HIGH" | "LOW" | "COMPLETED";
  status: "TODO" | "IN_PROGRESS" |"AWAIT_APPROVAL"| "COMPLETED";
  type:'BUG'|'DOCUMENTATION'|'FEATURE'|'IMPROVEMENT'|'OTHERS'|'PERFORMANCE'|'SECURITY'|'TASK'|'UI'|'UX'
  createdAt: string;
  comments: number[];
  assignerId: number,
  projectId: number,
  reporterId: number,
}
          
       
interface CardItemProps {
  todo: Todo;
  index: number;
}

const CardItem: React.FC<CardItemProps> = ({ todo, index }) => {

  const priorityColor =(status:string,priority:string)=>{

    if(status==="COMPLETED"){
       return "bg-success"
    }else{
      if(priority==="LOW"){
        return "bg-primary"
          
      }else if(priority==="MEDIUM"){
        return "bg-info"
          
      }else if(priority==="HIGH"){
          return "bg-warning"
      }else{
        return "bg-danger"
      }
    }
  }

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided) => (
        <div
          className="card shadow-sm mb-3"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-body">
            <header className="d-flex justify-content-between align-items-center mb-2">
              <span
                className={`badge ${priorityColor(todo.status,todo.priority)}`}
              >
                {todo.status === "COMPLETED" ? todo.status : todo.priority}
              </span>
            </header>

            <main className="mb-3">
              <h5 className="card-title">{todo.title}</h5>
              {todo.description && (
                <p className="card-text text-muted">{todo.description}</p>
              )}
            </main>

            <footer className="d-flex justify-content-between align-items-center flex-wrap gap-2">

              <div className="d-flex gap-3">
                <span className="d-flex align-items-center text-muted small">

                  {todo.comments.length} comments
                </span>
                <span className="d-flex align-items-center text-muted small">

                 
                </span>
              </div>
            </footer>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
