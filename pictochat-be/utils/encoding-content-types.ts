/**
 * This module defines the image encodings that are supported by the application
 */

/**
 * Supported image encoding -> HTTP Content-Type
 */
export const ENCODING_CONTENT_TYPES: Object = {
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif'
};

/**
 * Supported MIME type -> encoding
 */
export const MIMETYPE_TO_ENCODING: Object = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};
