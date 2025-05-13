"use client"

import { Trash2 } from "lucide-react"
import type { Todo } from "../components/todo-app"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import { motion } from "framer-motion"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <motion.li
      className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-card"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="transition-all duration-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-violet-500"
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-sm font-medium truncate transition-all duration-300 ${
            todo.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {todo.text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
        className="opacity-50 hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.li>
  )
}
