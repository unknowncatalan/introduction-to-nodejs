#!/bin/sh

mongoimport --db edx-course-db --collection m3-customer-data --file m3-customer-data.json --jsonArray --drop
mongoimport --db edx-course-db --collection m3-customer-address-data --file m3-customer-address-data.json --jsonArray --drop

