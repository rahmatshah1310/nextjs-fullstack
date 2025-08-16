"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: (open: boolean) => void;
  children: React.ReactNode;
  description?: string;
}

export function Modal({ title, description, open, onClose, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg 
    bg-white/70 dark:bg-gray-900/70   
    backdrop-blur-xl                
    border border-white/20           
    shadow-2xl                      
    rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
