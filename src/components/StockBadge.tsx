import React from 'react';

interface Props {
  stock: number;
}

export const StockBadge: React.FC<Props> = ({ stock }) => {
  if (stock === 0) {
    return <span className="badge bg-danger">Agotado (0)</span>;
  }
  if (stock <= 5) {
    return <span className="badge bg-warning text-dark">Bajo ({stock})</span>;
  }
  return <span className="badge bg-success">{stock} en stock</span>;
};
