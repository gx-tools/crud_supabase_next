"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Trash2, Plus, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Tasks, NewTask } from "@/types/supabase"
import { createClient } from "@/utils/supabase/client"
import { SupaBaseTableConstants } from "@/helpers/string_const"

export default function TodoApp() {
  const [todos, setTodos] = useState<Tasks[]>([])
  const [newTodo, setNewTodo] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  console.log("::: Todos :::", todos);

  useEffect(() => {
    const fetchTodos = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from(SupaBaseTableConstants.TASKS).select("*");
      if (error) throw error;
      setTodos(data);       
    }
    fetchTodos();
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const addTodo = async () => {
    console.log("::: Add Todo :::");
    if (newTodo.trim() === "") return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from(SupaBaseTableConstants.TASKS).insert({
        tasks: newTodo
      }).single();


      console.log({ data, error });


      if (error) throw error;
      

      setNewTodo("");
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } catch (error) {
      console.error(error);
    }
  }

  const toggleTodo = async (id: number) => {

    console.log("::: Toggle Todo :::", id);

    const supabase = createClient();
    const { error, data } = await supabase.from(SupaBaseTableConstants.TASKS).update({
      completed: !todos.find((todo) => todo.id === id)?.completed
    }).eq(SupaBaseTableConstants.ID, id);

    console.log("::: Toggle Todo Data :::", data);
    

    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    )
  }

  const deleteTodo = async (id: number) => {

    console.log("::: Delete Todo :::", id);
    

    const supabase = createClient();
    const { error ,data} = await supabase.from(SupaBaseTableConstants.TASKS).delete().eq(SupaBaseTableConstants.ID, id);

    console.log("::: Delete Todo Data :::", data);
    
    console.log("::: Delete Todo Error :::", error);

    if (error) throw error;
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-24 bg-background transition-colors duration-300">
      <Card className="w-full max-w-md mx-auto shadow-lg border-muted transition-all duration-300">
        <CardHeader className="pb-3 relative">
          <div className="absolute right-4 top-4">
            <ThemeToggle />
          </div>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2 pt-2">
            <CheckCircle2 className="h-7 w-7 text-primary" />
            Todo App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo()
                }
              }}
              className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary dark:bg-background dark:border-muted"
            />
            <Button onClick={addTodo} className="transition-all duration-200 hover:scale-105">
              <Plus className="h-5 w-5 mr-1" />
              Add
            </Button>
          </div>

          <AnimatePresence>
            {todos.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                No todos yet. Add one above!
              </motion.p>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {todos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/30 group dark:bg-muted/10"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          id={`todo-${todo.id}`}
                          className="transition-all duration-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor={`todo-${todo.id}`}
                          className={`transition-all duration-300 ${
                            todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {todo.tasks}
                        </label>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        aria-label="Delete todo"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground pt-0 pb-4">
          <p>Click the {todos.length > 0 ? "checkbox to mark as complete" : "plus button to add a todo"}</p>
        </CardFooter>
      </Card>
    </main>
  )
}
