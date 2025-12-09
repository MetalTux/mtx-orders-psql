// src/app/(main)/dashboard/clients/BranchPopup.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Client, ClientFormData, ClientBranch, ClientBranchFormData } from '@/types/clientTypes';
import { X, Save } from 'lucide-react';
import { LocationAPI } from '@/lib/LocationAPI';
import { Country, Region, Province, Commune } from '@/types/locationTypes';

interface BranchPopupProps {
  clientBranchToEdit: ClientBranch | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientBranchFormData, branchId?: string) => void;
  isLoading: boolean;
}