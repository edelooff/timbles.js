/**
* timbles-ext-multi-row-header.js
* An extension to timbles to add support for multi-row headers
*
* @version 0.1.0
* @author Elmer de Looff http://variable-scope.com
*/

( function( $ ) {

'use strict';

$.fn.timbles.methods.selectColumnHeaders = function() {
  var $cell, col, colOffset, colSpan, row, rowOffset, rowSpan;
  var $headerRows = this.find( 'thead tr' );
  var headerCells = {};
  var colCount = 0;

  // Resolve col/row-spans and determine column header candidates
  $headerRows.each( function( rowIndex ) {
    $( this ).find( 'th' ).each( function( colIndex ) {
      $cell = $( this );

      // Rowspans cause cells to be in a different place than the DOM suggests
      while ( headerCells.hasOwnProperty( [ rowIndex, colIndex ] ) ) {
        colIndex++;
      }

      // Determine cell size and update table column count
      rowSpan = parseInt( $cell.attr( 'rowspan' ) ) || 1;
      colSpan = parseInt( $cell.attr( 'colspan' ) ) || 1;
      colCount = Math.max( colIndex + colSpan, colCount );

      // Add cell to all 'grid spots' it occupies so we can detect spans
      // Cells that span multiple columns are never a column header
      $cell = ( colSpan === 1 ) ? $cell : null;
      for ( rowOffset = 0; rowOffset < rowSpan; rowOffset++ ) {
        for ( colOffset = 0; colOffset < colSpan; colOffset++ ) {
          headerCells[ [ rowIndex + rowOffset, colIndex + colOffset ] ] = $cell;
        }
      }
    } );
  } );

  // Determine actual column headers, search header rows bottom to top
  var headers = [];
  for ( col = 0; col < colCount; col++ ) {
    for ( row = $headerRows.length; row-- > 0; ) {
      $cell = headerCells[ [ row, col ] ];
      if ( $cell !== null ) {
        $cell.data( 'timbles-column-index', col );
        headers.push( $cell.get( 0 ) );
        break;
      }
    }
  }
  return $( headers );
};

} )( jQuery );
