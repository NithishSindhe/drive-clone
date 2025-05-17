"use client"

import { useState } from "react"
import {
  ChevronRight,
  File,
  FileText,
  Folder,
  Grid3X3,
  Home,
  ImageIcon,
  List,
  MoreVertical,
  Plus,
  Settings,
  Star,
  Trash,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import  DarkMode from  "@/components/dark-mode"

import type { FolderType, FileType } from "@/lib/mock-data"
import { mockFiles,mockFolders } from "@/lib/mock-data"


export default function DriveUI() {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [allFiles, setAllFiles] = useState(mockFiles)
  const [allFolders, setAllFolders] = useState(mockFolders)
  const [currentDirectory, setCurrentDirectory] = useState<string>('root')
  const [currentFilter, setCurrentFilter] = useState('all')
  const id_to_name = [...allFiles,...allFolders].reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {} as Record<string, string>);
  // Function to get file icon based on type
  const getFileIcon = (type: string) => {
  switch (type) {
    case "folder":
      return <Folder className="h-6 w-6 text-blue-500" />
    case "document":
      return <FileText className="h-6 w-6 text-blue-600" />
    case "spreadsheet":
      return <FileText className="h-6 w-6 text-green-600" />
    case "presentation":
      return <FileText className="h-6 w-6 text-orange-500" />
    case "pdf":
      return <FileText className="h-6 w-6 text-red-500" />
    case "image":
      return <ImageIcon className="h-6 w-6 text-purple-500" />
    default:
      return <File className="h-6 w-6 text-gray-500" />
  }
  }

  const navigateToFolder = (folder: FolderType, path: string[]) => {
    setCurrentPath([...path, folder.id])
    setCurrentDirectory(folder.id)
  }

  const navigateUp = () => {
    if (currentPath.length === 0) return
    const newPath = [...currentPath]
    newPath.pop()
    setCurrentDirectory(newPath[newPath.length - 1] ?? 'root');
    setCurrentPath(newPath)
  }

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        // Mock adding the files to the current directory
        const newFiles = [...allFiles]
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if(file){
            newFiles.push({
              id: `new-${Date.now()}-${i}`,
              url: `${currentPath.join("/")}/new-${Date.now()}-${i}`,
              name: file.name,
              type: 'file',
              size: `${(file.size / 1024).toFixed(0)} KB`,
              parent: currentDirectory
            });
          }
        }
        setAllFiles(newFiles)
      }
    }
    input.click()
  }
  function isFileType(item: FileType | FolderType): item is FileType {
    return item.type !== "folder" && 'size' in item && 'modified' in item;
  }
  const handleTabChange = (value: string) => {
    setCurrentFilter(value)
  };

  //const isValidFileType  = (type: string): type is FileTypeKind => {
  //  return validFileTypes.includes(type as FileType["type"]);
  //}

  const renderBlock = (file:FileType|FolderType):JSX.Element => {
    return <Card key={file.id} className="overflow-hidden">
      <div
        className="flex cursor-pointer flex-col p-4"
        onClick={() => (file.type === "folder" ? navigateToFolder(file, currentPath) : null)}
      >
        <div className="flex items-center justify-between">
          {getFileIcon(file.type)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Move</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-2">
          <h3 className="font-medium">{file.name}</h3>
          {file.type !== "folder" && (
            <p className="text-xs text-muted-foreground">
              {file.size}
            </p>
          )}
        </div>
      </div>
    </Card> 
  }

  return (
  <div className="flex h-screen w-screen bg-background">
    {/* Sidebar */}
    <div className="hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <div className="mb-8 flex items-center gap-2">
        <div className="rounded-lg bg-primary p-1">
          <Folder className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-primary">Drive Clone</h1>
      </div>
      

      <Button className="mb-6 w-full justify-start gap-2" onClick={handleUpload}>
        <Plus className="h-4 w-4" />
        <span>New</span>
      </Button>

      <div className="space-y-1 text-foreground">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {
            setCurrentPath([])
          }}
        >
          <Home className="h-4 w-4" />
          <span>My Drive</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Star className="h-4 w-4" />
          <span>Starred</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Trash className="h-4 w-4" />
          <span>Trash</span>
        </Button>
      </div>

      <Separator className="my-4" />

      <div className="mt-auto">
        <div className="mb-2 space-y-1">
          <p className="text-xs text-muted-foreground">Storage</p>
          <Progress value={35} className="h-2" />
          <p className="text-xs text-muted-foreground">3.5 GB of 15 GB used</p>
        </div>
        <Button variant="outline" className="w-full justify-start gap-2 text-foreground">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>
    </div>

    {/* Main content */}
    <div className="flex flex-1 flex-col text-muted-foreground">
      {/* Header */}
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Input className="max-w-sm" placeholder="Search in Drive" type="search" />
        <div className="ml-auto flex items-center gap-2">
          <DarkMode></DarkMode>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-muted" : ""}
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
          <Button variant="outline" className="gap-2  text-primary" onClick={handleUpload}>
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 border-b px-4 py-2 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCurrentPath([])
            setCurrentDirectory('root')
          }}
        >
          My Drive
        </Button>
        {currentPath.map((file_id, index) => {
          return <div key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Navigate to this specific path level
                const newPath = currentPath.slice(0, index + 1)
                const found = allFolders.find((item) => (file_id === item.id))
                if(found){
                  setCurrentDirectory(found.id)
                }
                setCurrentPath(newPath)
              }}
            >
              {id_to_name[file_id]}
            </Button>
          </div>
        })}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="all" onValueChange={handleTabChange} className="mb-4">
          <TabsList >
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
        </Tabs>

        {currentPath.length > 0 && (
          <Button variant="outline" size="sm" className="mb-4" onClick={navigateUp}>
            ← Back
          </Button>
        )}

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {allFolders.map((folder) => {
              if((currentFilter === 'folders' || currentFilter === 'all') && (folder.parent === currentDirectory)){
                return renderBlock(folder)
              }
              return null
            })}
            {allFiles.map((file) => {
              if((currentFilter == 'files' || currentFilter === 'all') && (file.parent === currentDirectory)){
                return renderBlock(file)
              }
              return null
            })}
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-2 p-3 font-medium">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Modified</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-1"></div>
            </div>
            <Separator />
            {[...allFiles,...allFolders].map((file) => {
              if(file.parent === currentDirectory){
                return <div key={file.id}>
                  <div
                    className="grid cursor-pointer grid-cols-12 items-center gap-2 p-3 hover:bg-muted/50"
                    onClick={() => (file.type === "folder" ? navigateToFolder(file, currentPath) : null)}
                  >
                    <div className="col-span-6 flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span>{file.name}</span>
                    </div>
                    <div className="col-span-3 text-sm text-muted-foreground">{isFileType(file) ? "modified" : "—"}</div>
                    <div className="col-span-2 text-sm text-muted-foreground">{isFileType(file) ? file.size : "—"}</div>
                    <div className="col-span-1 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Move</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <Separator />
                </div>
              }
              return null
            })}
          </div>
        )}
      </main>
    </div>
  </div>
  )
}


