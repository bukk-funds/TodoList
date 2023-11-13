import { useState, useEffect} from 'react'
import { nanoid } from "nanoid";
import Todo from "./Components/Todo";
import Form from "./Components/Form";
import FilterButton from "./Components/FilterButton";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);


function App(props) {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage or use default props.tasks
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    return savedTasks || props.tasks;
  });
  /*const [tasks, setTasks] = useState(props.tasks);*/
  const [filter, setFilter] = useState("All");
  
  useEffect(() => {
    // Save tasks to localStorage whenever tasks change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  
  /*function addTask(name) {
   const newTask = { id: `todo-${nanoid()}`, name, completed: false };
   setTasks([...tasks, newTask]);
}*/

function addTask(name) {
  if (name.trim() !== "") { // Check if the trimmed name is not empty
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }
}


function toggleTaskCompleted(id) {
  const updatedTasks = tasks.map((task) => {
    // if this task has the same ID as the edited task
    if (id === task.id) {
      // use object spread to make a new object
      // whose `completed` prop has been inverted
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  setTasks(updatedTasks);
}

function deleteTask(id) {
  const remainingTasks = tasks.filter((task) => id !== task.id);
  setTasks(remainingTasks);
}

function editTask(id, newName) {
  const editedTaskList = tasks.map((task) => {
    // if this task has the same ID as the edited task
    if (id === task.id) {
      //
      return { ...task, name: newName };
    }
    return task;
  });
  setTasks(editedTaskList);
}


  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  
  const filterList = FILTER_NAMES.map((name) => (
  <FilterButton
    key={name}
    name={name}
    isPressed={name === filter}
    setFilter={setFilter}
  />
));

  
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
const headingText = `${taskList.length} ${tasksNoun} remaining`;



  return (
    <div className="todoapp stack-large">
      <h1>Medical Student Planner</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
      {taskList}

      </ul>
       <footer style={{ textAlign: 'center', fontSize: '17px', color: '#000', marginTop: '10px' }}>
  Copyright &copy; 2023 Upright
</footer>

    </div>
  );
}
export default App;
