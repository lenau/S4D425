# S4D425

<!--- ## Exercise 4

1. Import the file **s4d425_flp_plugin_00.zip** and replace **00** with your group number **##** in the files:
   * Component.js
   * fioriSandboxConfig.json
   * manifest.json (2 times!) 
1. **Task 2 - 4.** Test your plugin within the SAP Fiori launchpad sandbox environment
1. **Task 3 - 4.** Deploy the SAP Fiori Launchpad Plugin to the ABAP S4D System
1. **Task 4** Activate the Deployed Plugin for Your User --->


## Exercise 13 - Implement Custom Logic for your Custom Business Object  

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
    
## Exercise 14 - Create and Use a Custom Library  
  
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

## Exercise 18 - Create a Database Table on the SAP BTP ABAP Environment  

    @EndUserText.label : 'Customer complaints about invoices'
    @AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
    @AbapCatalog.tableCategory : #TRANSPARENT
    @AbapCatalog.deliveryClass : #A
    @AbapCatalog.dataMaintenance : #RESTRICTED
    define table z425_complaint## {
        key client         : abap.clnt not null;  
        key uuid           : sysuuid_x16 not null;  
        complaint_id       : abap.numc(10) not null;  
        invoice_id         : abap.numc(10);  
        customer_id        : abap.numc(8);  
        customer_name      : abap.char(25);  
        reason             : abap.char(256);  
        action             : abap.char(256);  
        closed             : abap_boolean;  
        created_by         : abp_creation_user;  
        created_at         : abp_creation_tstmpl;  
        last_changed_by    : abp_lastchange_user;  
        last_changed       : abp_lastchange_tstmpl;  
        local_last_by      : abp_locinst_lastchange_user;  
        local_last_changed : abp_locinst_lastchange_tstmpl;

    }

## Exercise 23 - Create a Console Application to Test the Service Consumption Model  
```
        DATA(lo_http_destination) =  cl_http_destination_provider=>create_by_cloud_destination( i_name = 'S4D_100' ).
        ...  
        out->write( lt_business_data ).
```

## Exercise 25 - Implement the Query Implementation Class of the Custom Entity  
```
        lo_request->set_top(  CONV i( io_request->get_paging( )->get_page_size( ) )
                 )->set_skip( CONV i( io_request->get_paging( )->get_offset( ) ) ).
        ...
        ...
        ...
        io_response->set_total_number_of_records( lines( lt_business_data ) ).      
        io_response->set_data( lt_business_data ).
```

## Exercise 20 - Adjust the Labels of the SAP Fiori Elements Application  

````  
@Metadata.layer: #CUSTOMER
@UI: {
  headerInfo: {
    typeName: 'Complaint',
    typeNamePlural: 'Complaints',
    title: {
      type: #STANDARD,
      label: 'Complaint',
      value: 'ComplaintID'
    }
  }
}
annotate view ZC_425_COMPLAINT## with
{
  @UI.facet: [ {
    id: 'idCollection',
    type: #COLLECTION,
    label: 'Complaint',
    position: 10
  },
  {
    id: 'idIdentification',
    parentId: 'idCollection',
    type: #IDENTIFICATION_REFERENCE,
    label: 'General Information',
    position: 10
  } ]
  @UI.hidden: true
  UUID;

  @UI.lineItem: [ {
    position: 20 ,
    importance: #HIGH,
    label: 'Complaint ID'
  } ]
  @UI.identification: [ {
    position: 20 ,
    label: 'Complaint ID'
  } ]
  @UI.selectionField: [ {
    position: 20
  } ]
  ComplaintID;

  @UI.lineItem: [ {
    position: 30 ,
    importance: #HIGH,
    label: 'Invoice ID'
  } ]
  @UI.identification: [ {
    position: 30 ,
    label: 'Invoice ID'
  } ]
  InvoiceID;

  @UI.lineItem: [ {
    position: 40 ,
    importance: #HIGH,
    label: 'Customer ID'
  } ]
  @UI.identification: [ {
    position: 40 ,
    label: 'Customer ID'
  } ]
  CustomerID;

  @UI.lineItem: [ {
    position: 50 ,
    importance: #HIGH,
    label: 'Customer Name'
  } ]
  @UI.identification: [ {
    position: 50 ,
    label: 'Customer Name'
  } ]
  CustomerName;

  @UI.lineItem: [ {
    position: 60 ,
    importance: #HIGH,
    label: 'Reason'
  } ]
  @UI.identification: [ {
    position: 60 ,
    label: 'Reason'
  } ]
  Reason;

  @UI.lineItem: [ {
    position: 70 ,
    importance: #HIGH,
    label: 'Action'
  } ]
  @UI.identification: [ {
    position: 70 ,
    label: 'Action'
  } ]
  Action;

  @UI.lineItem: [ {
    position: 80 ,
    importance: #HIGH,
    label: 'Closed'
  } ]
  @UI.identification: [ {
    position: 80,
    label: 'Closed'
  } ]
  Closed;

  @UI.hidden: true
  CreatedBy;

  @UI.hidden: true
  CreatedAt;

  @UI.hidden: true
  LastChangedBy;

  @UI.hidden: true
  LastChanged;

  @UI.hidden: true
  LocalLastBy;

  @UI.hidden: true
  LocalLastChanged;
}
````

    

    




  
<!--- ## Exercise 21 

    <form:SimpleForm id="weightForm" title="Total" layout="ResponsiveGridLayout" minWidth="1024" maxContainerCols="2" 
                     class="sapUiForceWidthAuto sapUiResponsiveMargin" labelSpanL="3" labelSpanM="3" emptySpanL="5" 
                     emptySpanM="5" columnsL="1" columnsM="1">
      <Label id="weightLabel" text= "Weight"/>
      <Text  id="weightTotal" text="{WeightTotal} {WeightUnit}"/>
    </form:SimpleForm> --->
