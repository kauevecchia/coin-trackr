import { Dialog, DialogContent, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { DialogFooter, DialogHeader } from "./ui/dialog"

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteTransactionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: DeleteTransactionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteTransactionModal