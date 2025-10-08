import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  title?: string;
  itemName?: string;
  onConfirm: () => Promise<void>;
  trigger?: React.ReactNode;
}

export function DeleteConfirmModal({
  title = "Confirmar exclusão",
  itemName,
  onConfirm,
  trigger,
}: DeleteConfirmModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            {title}
          </DialogTitle>
          <DialogDescription className="space-y-2">
            {itemName && (
              <p className="font-medium">
                Tem certeza que deseja excluir:{" "}
                <span className="text-foreground">{itemName}</span>?
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
