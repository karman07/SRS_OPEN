import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddDialogProps } from "@/types/types";
import { useEffect, useState } from "react";
import { addTeacher } from "@/api/teachers";
import { X } from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AcademicOptionsResponse {
  branches: string[];
  semesters: string[];
}

const TagList = ({
  items,
  onRemove,
  theme,
}: {
  items: string[];
  onRemove: (i: number) => void;
  theme: string;
}) =>
  items.length === 0 ? null : (
    <div className="flex flex-wrap gap-2 mb-2">
      {items.map((item, i) => (
        <span
          key={i}
          className={`${
            theme === "dark" ? "bg-gray-600" : "bg-gray-200"
          } px-2 py-1 rounded flex items-center gap-1 text-sm`}>
          {item}
          <button onClick={() => onRemove(i)} className="text-red-500 hover:text-red-700">
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );

export const AddDialog = ({ isOpen, onClose, onAdd }: AddDialogProps) => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [branchOptions, setBranchOptions] = useState<string[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchAcademicOptions = async () => {
      try {
        const { data } = await axios.get<AcademicOptionsResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/auth/academic-options`,
        );
        if (data.branches?.length) {
          setBranchOptions(data.branches);
        }
        if (data.semesters?.length) {
          setSemesterOptions(data.semesters);
        }
      } catch (error) {
        console.error("Failed to load academic options:", error);
      }
    };

    fetchAcademicOptions();
  }, []);

  const handleAddBranch = (branch: string) => {
    if (!branches.includes(branch)) setBranches([...branches, branch]);
  };

  const handleAddSemester = (sem: string) => {
    if (!semesters.includes(sem)) setSemesters([...semesters, sem]);
  };

  const handleAddSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const handleSave = async () => {
    try {
      const response = await addTeacher({ name, branches, semesters, subjects });
      onAdd(response);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to add teacher:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setBranches([]);
    setSemesters([]);
    setSubjects([]);
    setSubjectInput("");
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Name:</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter teacher name"
            />
          </div>

          {/* Semesters — constant dropdown, no duplicates */}
          <div>
            <label className="block text-sm font-medium mb-1">Semesters:</label>
            <TagList items={semesters} onRemove={(i) => setSemesters(semesters.filter((_, idx) => idx !== i))} theme={theme} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  Select Semester
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {semesterOptions.map((sem) => (
                  <DropdownMenuItem
                    key={sem}
                    onClick={() => handleAddSemester(sem)}
                    disabled={semesters.includes(sem)}>
                    {sem} Semester
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Subjects — free text, one at a time */}
          <div>
            <label className="block text-sm font-medium mb-1">Subjects:</label>
            <TagList items={subjects} onRemove={(i) => setSubjects(subjects.filter((_, idx) => idx !== i))} theme={theme} />
            <div className="flex gap-2">
              <Input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
                placeholder="Enter subject and press Enter"
              />
              <Button type="button" onClick={handleAddSubject}>
                Add
              </Button>
            </div>
          </div>

          {/* Branches — constant dropdown, no duplicates */}
          <div>
            <label className="block text-sm font-medium mb-1">Branches:</label>
            <TagList items={branches} onRemove={(i) => setBranches(branches.filter((_, idx) => idx !== i))} theme={theme} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  Select Branch
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {branchOptions.map((branch) => (
                  <DropdownMenuItem
                    key={branch}
                    onClick={() => handleAddBranch(branch)}
                    disabled={branches.includes(branch)}>
                    {branch}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="destructive">Cancel</Button>
          </DialogClose>
          <Button variant="default" onClick={handleSave}>
            Add Teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
