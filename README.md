# S4D425

## Exercise 13

#### Determination:

    * set Invoice ID
    IF customerinvoice##-id IS INITIAL.
      SELECT MAX( id ) FROM zz1_customerinvoice## 
                  INTO @DATA(current_max_id).
      customerinvoice##-id = current_max_id + 1.
    ENDIF.
    
    * set Customer Name
    IF customerinvoice##-customerid IS NOT INITIAL.
      SELECT SINGLE FROM d425_i_cust##tp 
                  FIELDS name
                   WHERE id = @customerinvoice##-customerid
                    INTO @customerinvoice##-customername.
    ENDIF.

#### Validation:

    * decide about save rejection
    * Validation Messages
    message = COND #( WHEN customerinvoice##-amount_v   IS INITIAL THEN 'Invoice amount must be greater than 0'
                      WHEN customerinvoice##-amount_c   IS INITIAL THEN 'Invoice amount currency must be set'
                      WHEN customerinvoice##-customerid IS INITIAL THEN 'Customer ID must be set' ).
    valid   = COND #( WHEN message IS INITIAL THEN abap_true
                                              ELSE abap_false ).
    
#### Action:

**Label**: Apply Customer Discount
**Identifier**: ApplyCustomerDiscount
    
    SELECT SINGLE FROM d425_i_cust##tp 
                FIELDS zz1_discount_##_g##
                 WHERE id = @customerinvoice##-customerid
                  INTO @customerinvoice##-discount.
    IF sy-subrc = 0.
      customerinvoice##-discountamount_v = ( customerinvoice##-amount_v * customerinvoice##-discount ) / 100.
      customerinvoice##-discountamount_c = customerinvoice##-amount_c.
    ELSE.
      message = VALUE #(
        severity = co_severity-error
        text = 'Discount could not be determined'
      ).
    ENDIF.
