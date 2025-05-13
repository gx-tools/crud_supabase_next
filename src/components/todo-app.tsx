"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import TodoList from "../components/todo-list"
import { useToast } from "../hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export default function TodoApp() {
  const { toast } = useToast()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setTodos([
        { id: "1", text: "Learn Next.js", completed: false, createdAt: new Date() },
        { id: "2", text: "Build a Todo app", completed: false, createdAt: new Date() },
        { id: "3", text: "Deploy to Vercel", completed: false, createdAt: new Date() },
      ])
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const addTodo = () => {
    if (newTodo.trim() === "") return

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      createdAt: new Date(),
    }

    setTodos([...todos, todo])
    setNewTodo("")

    toast({
      title: "Task added",
      description: "Your new task has been added successfully.",
    })
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newStatus = !todo.completed

          toast({
            title: newStatus ? "Task completed" : "Task reopened",
            description: newStatus ? "Great job! Task marked as complete." : "Task has been reopened.",
            variant: newStatus ? "default" : "destructive",
          })

          return { ...todo, completed: newStatus }
        }
        return todo
      }),
    )
  }

  const deleteTodo = (id: string) => {
    const todoToDelete = todos.find((todo) => todo.id === id)
    setTodos(todos.filter((todo) => todo.id !== id))

    toast({
      title: "Task deleted",
      description: `"${todoToDelete?.text.substring(0, 20)}${todoToDelete?.text.length > 20 ? "..." : ""}" has been removed.`,
      variant: "destructive",
    })
  }

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2 mb-6">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo()
            }
          }}
          className="flex-1 transition-all duration-200 border-2 focus-visible:ring-offset-2 h-12"
        />
        <Button
          onClick={addTodo}
          className="h-12 transition-all duration-300 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Task
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center p-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
