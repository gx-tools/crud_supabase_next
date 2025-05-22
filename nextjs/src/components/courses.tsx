"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Trash2, Plus, CheckCircle2, Edit, Loader2, Server, Database, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/utils/supabase/client"
import { AuthRouteConstants, SupaBaseTableConstants, SupaBaseRoleConstants, ApiRouteConstants } from "@/helpers/string_const"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Task } from "@/types/supabase"
import Navbar from "@/components/navbar"
import { getRequest, postRequest, putRequest, deleteRequest, handleError } from "@/helpers/handlers"

export default function Courses() {
  const [todos, setTodos] = useState<Task[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const router = useRouter()
  const [useApi, setUseApi] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)
  const [isTogglingId, setIsTogglingId] = useState<number | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  console.log("::: courses :::");

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      if (useApi) {
        // Use the API endpoint
        const response = await getRequest(ApiRouteConstants.TASKS);
        setTodos(response.data || []);
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { data, error } = await supabase.from(SupaBaseTableConstants.TASKS).select("*");
        if (error) throw error;
        setTodos(data);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      handleError(error);
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      if (useApi) {
        // Use the API endpoint
        const response = await getRequest(ApiRouteConstants.USERS);
        setUserRole(response.data?.role);
        setEmail(response.data?.email);
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { data, error } = await supabase.from(SupaBaseTableConstants.USERS).select("*").single();
        if (error) throw error;
        setUserRole(data?.role);
        setEmail(data?.email);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      handleError(error);
    }
  }
  
  useEffect(() => {
    fetchTodos();
  }, [useApi]);

  useEffect(() => {
    fetchUser();
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const hasWritePermission = () => {
    return userRole === SupaBaseRoleConstants.ADMIN || userRole === SupaBaseRoleConstants.INSTRUCTOR;
  }

  const addTodo = async () => {
    if (!hasWritePermission()) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    if (newTodo.trim() === "") return;
    try {
      setIsSubmitting(true)
      
      if (useApi) {
        if (editingTodoId) {
          // Update existing task via API
          await putRequest(`${ApiRouteConstants.TASKS}/${editingTodoId}`, { title: newTodo });
          setEditingTodoId(null);
          toast.success("Todo updated successfully!");
        } else {
          // Create new task via API
          await postRequest(ApiRouteConstants.TASKS, { title: newTodo });
          toast.success("Todo added successfully!");
        }
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        if (editingTodoId) {
          const { error } = await supabase.from(SupaBaseTableConstants.TASKS).update({
            title: newTodo
          }).eq(SupaBaseTableConstants.ID, editingTodoId);

          if (error) throw error;
          setEditingTodoId(null);
          toast.success("Todo updated successfully!");
        } else {
          const { error } = await supabase.from(SupaBaseTableConstants.TASKS).insert({
            title: newTodo
          }).single();

          if (error) throw error;
          toast.success("Todo added successfully!");
        }
      }
      
      await fetchTodos();
      setNewTodo("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Error adding/editing todo:", error);
      handleError(error);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditTodo = (todo: Task) => {
    if (!hasWritePermission()) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    setNewTodo(todo.title);
    setEditingTodoId(todo.id);
  }

  const toggleTodo = async (id: number) => {
    if (!hasWritePermission()) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    try {
      setIsTogglingId(id)
      const currentTodo = todos.find((todo) => todo.id === id);
      if (!currentTodo) return;
      
      if (useApi) {
        // Use the API endpoint
        await putRequest(`${ApiRouteConstants.TASKS}/${id}`, { completed: !currentTodo.completed });
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { error } = await supabase.from(SupaBaseTableConstants.TASKS).update({
          completed: !currentTodo.completed
        }).eq(SupaBaseTableConstants.ID, id);

        if (error) throw error;
      }
      
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
      )
      toast.success("Todo status updated!");
    } catch (error) {
      console.error("Error toggling todo:", error);
      handleError(error);
    } finally {
      setIsTogglingId(null)
    }
  }

  const deleteTodo = async (id: number) => {
    if (!hasWritePermission()) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    try {
      setIsDeletingId(id)
      
      if (useApi) {
        // Use the API endpoint
        await deleteRequest(`${ApiRouteConstants.TASKS}/${id}`);
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { error } = await supabase.from(SupaBaseTableConstants.TASKS).delete().eq(SupaBaseTableConstants.ID, id);

        if (error) throw error;
      }
      
      setTodos(todos.filter((todo) => todo.id !== id))
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
      handleError(error);
    } finally {
      setIsDeletingId(null)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      if (useApi) {
        // Use the API endpoint
        await postRequest(ApiRouteConstants.AUTH_LOGOUT, {});
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      router.push(AuthRouteConstants.LOGIN);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      handleError(error);
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
    <Navbar />
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-24 bg-background transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-4">Testing</h1>
      <Card className="w-full max-w-md mx-auto shadow-lg border-muted transition-all duration-300">
        <CardHeader className="pb-3 relative">
          <div className="absolute right-4 top-4">
            <ThemeToggle />
          </div>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2 pt-2">
            <CheckCircle2 className="h-7 w-7 text-primary" />
            Todo App
          </CardTitle>
          {userRole && (
          <>
            <p className="text-center text-sm text-muted-foreground">
              Logged in as: {userRole}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Email: {email}
            </p>
            </>
          )}
          <div className="flex items-center space-x-2 justify-center mt-2">
            <div className="flex items-center space-x-2">
              <Database className={`h-4 w-4 ${!useApi ? "text-primary" : "text-muted-foreground"}`} />
              <Switch 
                id="api-toggle"
                checked={useApi}
                onCheckedChange={setUseApi}
              />
              <Server className={`h-4 w-4 ${useApi ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <Label htmlFor="api-toggle">{useApi ? "Using API" : "Using Supabase"}</Label>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => fetchTodos()}
              disabled={isLoading}
              className="ml-2 hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Refresh todos"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hasWritePermission() && (
            <div className="flex gap-2 mb-6">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    addTodo()
                  }
                }}
                disabled={isSubmitting}
                className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary dark:bg-background dark:border-muted"
              />
              <Button 
                onClick={addTodo} 
                disabled={isSubmitting}
                className="transition-all duration-200 hover:scale-105"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {editingTodoId ? "Edit" : "Add"}
                    <Plus className="h-5 w-5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}

          <Button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="mb-4 transition-all duration-200 hover:scale-105 w-full"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Logout"
            )}
          </Button>

          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : todos.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                No todos yet. {hasWritePermission() ? "Add one above!" : "Check back later for updates."}
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
                        {hasWritePermission() ? (
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            id={`todo-${todo.id}`}
                            disabled={isTogglingId === todo.id}
                            className="transition-all duration-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        ) : (
                          <div className={`w-4 h-4 rounded-sm border ${todo.completed ? 'bg-primary border-primary' : 'border-input'}`} />
                        )}
                        <label
                          htmlFor={`todo-${todo.id}`}
                          className={`transition-all duration-300 ${
                            todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {todo.title}
                        </label>
                        {isTogglingId === todo.id && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {hasWritePermission() && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTodo(todo)}
                            disabled={isSubmitting}
                            aria-label="Edit todo"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {hasWritePermission() && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTodo(todo.id)}
                          disabled={isDeletingId === todo.id}
                          aria-label="Delete todo"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
                        >
                          {isDeletingId === todo.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground pt-0 pb-4">
          {hasWritePermission() ? (
            <p>Click the {todos.length > 0 ? "checkbox to mark as complete" : "plus button to add a todo"}</p>
          ) : (
            <p>You are in view-only mode</p>
          )}
        </CardFooter>
      </Card>
    </main>
    </>
  )
}
