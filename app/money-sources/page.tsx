"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaWallet, FaUniversity, FaCreditCard, FaTrash, FaTable, FaTh } from "react-icons/fa";
import { moneySourceRequests, MoneySource, MoneySourceFilterParams } from "./_requests";
import { appSettingsRequests } from "../settings/_requests";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Loader from "@/components/UI/Loader";
import { AddMoneySourceModal } from "@/components/MoneySource/AddMoneySourceModal";
import { UpdateMoneySourceModal } from "@/components/MoneySource/UpdateMoneySourceModal";
import { AddFundsModal } from "@/components/MoneySource/AddFundsModal";
import { DeleteConfirmationModal } from "@/components/UI/DeleteConfirmationModal";
import { FilterToolbar } from "@/components/UI/FilterToolbar";
import { Pagination } from "@/components/UI/Pagination";
import { MoneySourcesTableView } from "@/components/MoneySource/MoneySourcesTableView";
import { MoneySourcesPageSkeleton } from "@/components/UI/SkeletonLoaders";
import { toast } from "sonner";

// Icon mapping function - not a React component, so don't use memo here
const getIconComponent = (icon: string) => {
  const icons = {
    wallet: FaWallet,
    bank: FaUniversity,
    "credit-card": FaCreditCard
  };
  return icons[icon as keyof typeof icons] || FaCreditCard;
};

// Optimized Card component with memoization
interface CardProps {
  source: MoneySource;
  preferredCurrency: string;
}

const Card = React.memo(({ source, preferredCurrency }: CardProps) => {
  const Icon = getIconComponent(source.icon);
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const showPreferredCurrency = source.currency !== preferredCurrency;

  // Memoized handlers to prevent recreation of functions on each render
  const handleOpenDeleteModal = useCallback(() => setIsDeleteOpen(true), []);
  const handleCloseDeleteModal = useCallback(() => setIsDeleteOpen(false), []);

  const { mutate: deleteMoneySource, isPending: isDeleting } = useMutation({
    mutationFn: () => moneySourceRequests.deleteMoneySource(source.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["money-sources"] });
      toast.success("Money source deleted successfully");
      setIsDeleteOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete money source");
    },
  });
  
  const handleConfirmDelete = useCallback(() => deleteMoneySource(), [deleteMoneySource]);
  
  // Memoize style calculations to avoid recalculating on every render
  const { backgroundStyle, shadowStyle, borderStyle } = useMemo(() => {
    // Handle cardStyle properly - it might be an object already, not a string
    const cardStyle = source.cardStyle ? 
      (typeof source.cardStyle === 'string' ? JSON.parse(source.cardStyle) : source.cardStyle) : 
      {};

    let bgStyle = {};
    if (cardStyle.background) {
      try {
        // If it's a JSON string that was already stringified, parse it
        if (typeof cardStyle.background === 'string' &&
          (cardStyle.background.startsWith('{') || cardStyle.background.includes('gradient'))) {
          const parsedBackground = JSON.parse(cardStyle.background);
          bgStyle = parsedBackground;
        }
        // If it's already an object
        else if (typeof cardStyle.background === 'object') {
          bgStyle = cardStyle.background;
        }
        // If it's a plain color string
        else if (typeof cardStyle.background === 'string') {
          bgStyle = { backgroundColor: cardStyle.background };
        }
      } catch (e) {
        console.error("Error parsing background style:", e);
        // Fallback to treating it as a plain color
        if (typeof cardStyle.background === 'string') {
          bgStyle = { backgroundColor: cardStyle.background };
        }
      }
    }

    const shdwStyle = cardStyle.shadow ?
      { boxShadow: typeof cardStyle.shadow === 'string' ? cardStyle.shadow : 'none' } :
      {};

    const brdStyle = cardStyle.border ?
      { border: typeof cardStyle.border === 'string' ? cardStyle.border : 'none' } :
      {};
      
    return { backgroundStyle: bgStyle, shadowStyle: shdwStyle, borderStyle: brdStyle };
  }, [source.cardStyle]);
  return (
    <>
      <div
        className="relative w-full p-4 sm:p-6 h-auto rounded-[var(--border-radius)] overflow-hidden group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
        style={{
          ...backgroundStyle,
          ...shadowStyle,
          ...borderStyle
        }}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/15 transition-all duration-300" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-white/10 rounded-full group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
              <Icon className="text-white text-xl sm:text-2xl" />
            </div>            
            <div className="flex items-center gap-1 sm:gap-2">
              <AddFundsModal moneySource={source} />
              <UpdateMoneySourceModal moneySource={source} />              
              <button
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 active:scale-95 cursor-pointer hover:scale-110"
                onClick={handleOpenDeleteModal}
              >
                <FaTrash className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-1 group-hover:translate-x-2 transition-transform duration-300">
              {source.name}
              {source.isDefault && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-white/20 text-white text-xs rounded-full group-hover:bg-white/30 transition-colors duration-300">
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white"></span>
                  </span>
                  Default
                </span>
              )}
            </h3>
            <p className="text-white/75 text-xs sm:text-sm group-hover:text-white/90 transition-colors duration-300">
              Last Modified {new Date(source.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-6 mb-2 sm:mb-4">
            <div className="p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 group-hover:translate-y-[-2px] transition-all duration-300">
              <p className="text-white/75 text-xs sm:text-sm mb-0.5 sm:mb-1">Balance</p>
              <p className="font-mono text-base sm:text-lg text-white">
                {source.balance} {source.currency}
              </p>
              {showPreferredCurrency && (
                <p className="font-mono text-xs sm:text-sm text-white/70 mt-0.5 sm:mt-1">
                  {source?.balanceInPreferredCurrency?.toFixed(2)} {preferredCurrency}
                </p>
              )}
            </div>

            <div className="p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 group-hover:translate-y-[-2px] transition-all duration-300">
              <p className="text-white/75 text-xs sm:text-sm mb-0.5 sm:mb-1">Budget</p>
              <p className="font-mono text-base sm:text-lg text-white">
                {source.budget} {source.currency}
              </p>
              {showPreferredCurrency && (
                <p className="font-mono text-xs sm:text-sm text-white/70 mt-0.5 sm:mt-1">
                  {source?.budgetInPreferredCurrency?.toFixed(2)} {preferredCurrency}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Money Source"
        message={`Are you sure you want to delete "${source.name}"? This will also delete all associated expenses and cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo that prevents unnecessary re-renders
  return (
    prevProps.source.id === nextProps.source.id &&
    prevProps.source.name === nextProps.source.name &&
    prevProps.source.balance === nextProps.source.balance &&
    prevProps.source.budget === nextProps.source.budget &&
    prevProps.source.currency === nextProps.source.currency &&
    prevProps.source.isDefault === nextProps.source.isDefault &&
    prevProps.source.updatedAt === nextProps.source.updatedAt &&
    prevProps.source.cardStyle === nextProps.source.cardStyle &&
    prevProps.preferredCurrency === nextProps.preferredCurrency
  );
});


Card.displayName = 'Card';

const MoneySourcesPage = () => {
  // State hooks - all at the top
  const [viewMode, setViewMode] = useState<'card' | 'table'>(() => {
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem('moneySourcesViewMode');
      return (savedViewMode === 'table') ? 'table' : 'card';
    }
    return 'card';
  });
  
  const [filterParams, setFilterParams] = useState<MoneySourceFilterParams>({
    page: 1,
    pageSize: 10
  });
  
  const [deleteModalData, setDeleteModalData] = useState<{ isOpen: boolean; source: MoneySource | null }>({
    isOpen: false,
    source: null
  });


  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  

  const handleCardViewClick = useCallback(() => setViewMode('card'), []);
  const handleTableViewClick = useCallback(() => setViewMode('table'), []);
  
  const handleFilterChange = useCallback((newFilters: MoneySourceFilterParams) => {
    setFilterParams(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilterParams(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilterParams(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const handleSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilterParams(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);
  
  const handleDelete = useCallback((source: MoneySource) => {
    setDeleteModalData({ isOpen: true, source });
  }, []);
  
  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalData({ isOpen: false, source: null });
  }, []);
  
  const handleEditInTableView = useCallback((source: MoneySource) => {
    setViewMode('card');
    toast.info(
      `Switched to card view. Please find and edit ${source.name} using the pencil icon.`,
      { duration: 5000 }
    );
  }, []);

  // Queries and mutations
  const { data: moneySourcesResponse, isLoading } = useQuery({
    queryKey: ["money-sources", filterParams],
    queryFn: async () => {
      return moneySourceRequests.getMoneySources(filterParams);
    },
  });

  const { data: appSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: appSettingsRequests.getAppSettings,
  });
  
  const { mutate: deleteMoneySource, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => moneySourceRequests.deleteMoneySource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["money-sources"] });
      toast.success("Money source deleted successfully");
      setDeleteModalData({ isOpen: false, source: null });
    },
    onError: () => {
      toast.error("Failed to delete money source");
    },
  });
  
  // Fix dependency array for handleConfirmDeleteInTable
  const fixedHandleConfirmDelete = useCallback(() => {
    if (deleteModalData.source) {
      deleteMoneySource(deleteModalData.source.id);
    }
  }, [deleteModalData.source, deleteMoneySource]);
  
  // Memoized data arrays
  const sortOptions = useMemo(() => [
    { label: 'Name', value: 'name' },
    { label: 'Balance', value: 'balance' },
    { label: 'Budget', value: 'budget' },
    { label: 'Created Date', value: 'createdAt' },
    { label: 'Updated Date', value: 'updatedAt' }  ], []);
  
  // Effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moneySourcesViewMode', viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);
  // Rendering with early returns
  if (!isAuthenticated) {
    return <Loader />;
  }
  
  if (isLoading || isLoadingSettings) {
    return <MoneySourcesPageSkeleton />;
  }
  
  // Main UI render
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:mb-8 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          Money Sources
        </h1>

        <div className="flex items-center gap-3">
          {/* View toggle */}          <div className="flex p-1 bg-[var(--bgSecondary)] rounded-lg">            
            <button
              className={`p-2 rounded-md cursor-pointer ${viewMode === 'card' ? 'bg-[var(--bg)] shadow-sm' : ''}`}
              onClick={handleCardViewClick}
              aria-label="Card view"
              title="Card view"
            >
              <FaTh className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-md cursor-pointer ${viewMode === 'table' ? 'bg-[var(--bg)] shadow-sm' : ''}`}
              onClick={handleTableViewClick}
              aria-label="Table view"
              title="Table view"
            >
              <FaTable className="w-4 h-4" />
            </button>
          </div>
          <AddMoneySourceModal />
        </div>
      </div>
        {/* Filter toolbar */}      <FilterToolbar
        onFilterChange={handleFilterChange}
        sortOptions={sortOptions}
      />

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {moneySourcesResponse?.data?.map((source: MoneySource) => (
            <Card
              key={source?.id}
              source={source}
              preferredCurrency={appSettings?.preferredCurrency || "USD"}
            />
          ))}
        </div>
      )}      
      
      {/* Table View */}
      {viewMode === 'table' && (
        <>
          <MoneySourcesTableView
            data={moneySourcesResponse?.data || []}
            isLoading={isLoading}
            preferredCurrency={appSettings?.preferredCurrency || "USD"}
            onSort={handleSort}
            sortBy={filterParams.sortBy}
            sortOrder={filterParams.sortOrder}            
            onEdit={handleEditInTableView}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* Show message when no results */}
      {moneySourcesResponse?.data?.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-lg text-[var(--text-secondary)]">No money sources found matching your filters.</p>
        </div>
      )}

      {/* Pagination */}
      {moneySourcesResponse && (
        <Pagination
          currentPage={filterParams.page || 1}
          totalPages={moneySourcesResponse.totalPages || 1}
          onPageChange={handlePageChange}
          totalItems={moneySourcesResponse.totalCount || 0}
          pageSize={filterParams.pageSize || 10}
          onPageSizeChange={handlePageSizeChange}
        />
      )}      
      
      {/* Delete confirmation modal for table view */}
      <DeleteConfirmationModal
        isOpen={deleteModalData.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={fixedHandleConfirmDelete}
        title="Delete Money Source"
        message={`Are you sure you want to delete "${deleteModalData.source?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default MoneySourcesPage;
