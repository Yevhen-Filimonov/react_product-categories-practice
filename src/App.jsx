/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getCategoryById = id =>
  categoriesFromServer.find(category => category.id === id);

const getUserById = id => usersFromServer.find(user => user.id === id);

const products = productsFromServer.map(product => {
  const category = getCategoryById(product.categoryId); // find by product.categoryId
  const user = category ? getUserById(category.ownerId) : null; // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = categoryId => {
    setSelectedCategoryIds(prevSelected => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter(id => id !== categoryId);
      }
      return [...prevSelected, categoryId];
    });
  };

  const handleResetFilters = () => {
    setSelectedUserId(null);
    setSelectedCategoryIds([]);
    setSearchQuery('');
  };

  const filteredProducts = products.filter(product => {
    const matchesUser = !selectedUserId || product.user?.id === selectedUserId;
    const matchesCategory =
      selectedCategoryIds.length === 0 ||
      selectedCategoryIds.includes(product.category?.id);
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesUser && matchesCategory && matchesSearch;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUserId(null)}
                className={!selectedUserId ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedUserId(user.id)}
                  className={selectedUserId === user.id ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search by product name"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchQuery && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${selectedCategoryIds.length === 0 ? 'is-outlined' : ''}`}
                onClick={() => setSelectedCategoryIds([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${
                    selectedCategoryIds.includes(category.id) ? 'is-info' : ''
                  }`}
                  href="#/"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.icon} {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Owner</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(({ id, name, category, user }) => (
                  <tr key={id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {id}
                    </td>
                    <td data-cy="ProductName">{name}</td>
                    <td data-cy="ProductCategory">
                      {category
                        ? `${category.icon} - ${category.title}`
                        : 'Unknown'}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        user?.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                      }
                    >
                      {user ? user.name : 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
