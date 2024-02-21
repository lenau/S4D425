# S4D425

<!--- ## Exercise 4

1. Import the file **s4d425_flp_plugin_00.zip** and replace **00** with your group number **##** in the files:
   * Component.js
   * fioriSandboxConfig.json
   * manifest.json (2 times!) 
1. **Task 2 - 4.** Test your plugin within the SAP Fiori launchpad sandbox environment
1. **Task 3 - 4.** Deploy the SAP Fiori Launchpad Plugin to the ABAP S4D System
1. **Task 4** Activate the Deployed Plugin for Your User --->


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
      SELECT SINGLE FROM d425_i_cust## 
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
    
    SELECT SINGLE FROM d425_i_cust## 
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
    
## Exercise 14  
  
    SELECT SINGLE FROM d425_i_cust## 
                FIELDS zz1_discount_##_g##
                 WHERE id = @customerinvoice##-customerid
                  INTO @customerinvoice##-discount.
    IF sy-subrc = 0.
    * old:
    * customerinvoice##-discountamount_v = ( customerinvoice##-amount_v * customerinvoice##-discount ) / 100.
    * new:
      customerinvoice##-discountamount_v = 
        zz1_customer_functions_##=>calc_discount_amount(
          amount = customerinvoice##-amount_v
          discount = customerinvoice##-discount
        ).
      customerinvoice##-discountamount_c = customerinvoice##-amount_c.
    ELSE.
      message = VALUE #(
        severity = co_severity-error
        text = 'Discount could not be determined'
      ).
    ENDIF.

## Exercise 18  

    @EndUserText.label : 'Customer complaints about invoices'
    @AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
    @AbapCatalog.tableCategory : #TRANSPARENT
    @AbapCatalog.deliveryClass : #A
    @AbapCatalog.dataMaintenance : #RESTRICTED
    define table z425_complaintxx {
        key client         : abap.clnt not null;  
        key uuid           : sysuuid_x16 not null;  
        complaint_id       : abap.numc(10) not null;  
        invoice_id         : abap.numc(10);  
        customer_id        : abap.numc(8);  
        customer_name      : abap.char(25);  
        reason             : abap.char(256);  
        action             : abap.char(256);  
        closed             : abap_boolean;  
        created_by         : syuname;  
        created_at         : timestampl;  
        last_changed_by    : syuname;  
        last_changed       : abp_lastchange_tstmpl;  
        local_last_changed : abp_locinst_lastchange_tstmpl;  
    }




  
<!--- ## Exercise 21 

    <form:SimpleForm id="weightForm" title="Total" layout="ResponsiveGridLayout" minWidth="1024" maxContainerCols="2" 
                     class="sapUiForceWidthAuto sapUiResponsiveMargin" labelSpanL="3" labelSpanM="3" emptySpanL="5" 
                     emptySpanM="5" columnsL="1" columnsM="1">
      <Label id="weightLabel" text= "Weight"/>
      <Text  id="weightTotal" text="{WeightTotal} {WeightUnit}"/>
    </form:SimpleForm> --->
