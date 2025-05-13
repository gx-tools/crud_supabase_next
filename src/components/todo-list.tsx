"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { Todo } from "../components/todo-app"
import TodoItem from "../components/todo-item"
import { Sparkles } from "lucide-react"

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center p-12 border border-dashed rounded-xl bg-muted/30 dark:bg-muted/10"
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">All clear!</h3>
          <p className="text-muted-foreground max-w-xs">
            You have no tasks yet. Add a new task above to get started on your productivity journey.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
          </motion.div>
        ))}
      </AnimatePresence>
    </ul>
  )
}
