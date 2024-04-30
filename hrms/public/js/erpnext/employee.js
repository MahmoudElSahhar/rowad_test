// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Employee", {
	refresh: function (frm) {
		frm.set_query("payroll_cost_center", function () {
			return {
				filters: {
					"company": frm.doc.company,
					"is_group": 0
				}
			};
		});

		if (!frm.doc.resignation_letter_date) return

		frappe.db.get_list("Salary Withholding", {
			filters: {
				"employee": frm.doc.name
			}
		}).then((docs) => {
			if (!docs[0]) {
				frm.add_custom_button(__("Create Salary Withholding Document"), () => {
					frappe.route_options = {
						employee: frm.doc.name,
					};
					frappe.set_route("Form", "Salary Withholding");
				})
			}
		})
	},
	date_of_birth(frm) {
		frm.call({
			method: "hrms.overrides.employee_master.get_retirement_date",
			args: {
				date_of_birth: frm.doc.date_of_birth
			}
		}).then((r) => {
			if (r && r.message)
				frm.set_value("date_of_retirement", r.message);
		});
	}
})