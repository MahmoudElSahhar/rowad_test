// Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Interview Round", {
	refresh: function (frm) {
		if (!frm.doc.__islocal) {
			frm.add_custom_button(__("Create Interview"), function () {
				frm.events.create_interview(frm);
			});
		}
	},
	designation: function (frm) {
		frm.set_value("expected_skill_set", null);
		if (frm.doc.designation) {
			frappe.db.get_doc("Designation", frm.doc.designation).then((designation) => {
				designation.skills.forEach((designation_skill) => {
					let row = frappe.model.add_child(
						frm.doc,
						"Expected Skill Set",
						"expected_skill_set",
					);
					row.skill = designation_skill.skill;
				});
				refresh_field("expected_skill_set");
			});
		}
	},
	create_interview: function (frm) {
		frappe.call({
			method: "hrms.hr.doctype.interview_round.interview_round.create_interview",
			args: {
				doc: frm.doc,
			},
			callback: function (r) {
				var doclist = frappe.model.sync(r.message);
				frappe.set_route("Form", doclist[0].doctype, doclist[0].name);
			},
		});
	},
});
