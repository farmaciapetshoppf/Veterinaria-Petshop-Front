"use client"

import { useEffect, useState } from 'react';
import { getAllCategories } from '../../services/product.services';
import CardCategory from '../CardCategory/CardCategory';

function HomeCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const data = await getAllCategories();
      setCategories(data);
    }

    loadCategories();
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      {categories.map(category => (
        <CardCategory key={category.id} {...category} />
      ))}
    </div>
  );
}

export default HomeCategories;

