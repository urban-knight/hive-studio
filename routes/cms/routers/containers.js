const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
const ContainerUtil = require("../../../utils/container");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res) => {
    var pagesContainer = await models.Container.findOne({ label: "Main-Pages" }).populate({path: 'objects.item', populate: { path: 'category' }});
    var pages = ContainerUtil.unload(pagesContainer);

    var projectsContainer = await models.Container.findOne({ label: "Main-Projects" }).populate({ path: 'objects.item', populate: { path: 'pages' } });
    var projects = ContainerUtil.unload(projectsContainer);

    var vacanciesContainer = await models.Container.findOne({ label: "Main-Vacancies" }).populate({ path: 'objects.item' });
    var vacancies = ContainerUtil.unload(vacanciesContainer);

    var publicationsContainer = await models.Container.findOne({ label: "Main-Publications" }).populate({ path: 'objects.item' });
    var publications = ContainerUtil.unload(publicationsContainer);

    return res.render("cms/containers/index", {pages: pages, projects: projects, vacancies: vacancies, publications: publications});
}));

// Pages Swap
router.post("/swap-pages", wrap(async (req, res) => {
    var session = req.body.session;
    var pagesContainer = await models.Container.findOne({ label: "Main-Pages" });

    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this;
    };

    if (session.startIndex != session.stopIndex) {
        pagesContainer.objects.move(session.startIndex, session.stopIndex);
        await pagesContainer.save();
    }

    return res.status(200).send({ message: "Pages are swapped successfully" });
}));

// Projects Swap
router.post("/swap-projects", wrap(async (req, res) => {
    var session = req.body.session;
    var projectsContainer = await models.Container.findOne({ label: "Main-Projects" }).populate({ path: 'objects.item', populate: { path: 'pages' } });

    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this;
    };

    if (session.startIndex != session.stopIndex) {
        projectsContainer.objects.move(session.startIndex, session.stopIndex);
        await projectsContainer.save();
    }

    return res.status(200).send({ message: "Projects are swapped successfully" });
}));

// Vacancies Swap
router.post("/swap-vacancies", wrap(async (req, res) => {
    var session = req.body.session;
    var vacanciesContainer = await models.Container.findOne({ label: "Main-Vacancies" }).populate({ path: 'objects.item' });

    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this;
    };

    if (session.startIndex != session.stopIndex) {
        vacanciesContainer.objects.move(session.startIndex, session.stopIndex);
        await vacanciesContainer.save();
    }

    return res.status(200).send({ message: "Vacancies are swapped successfully" });
}));

// Publications Swap
router.post("/swap-publications", wrap(async (req, res) => {
    var session = req.body.session;
    var publicationsContainer = await models.Container.findOne({ label: "Main-Publications" }).populate({ path: 'objects.item' });

    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this;
    };

    if (session.startIndex != session.stopIndex) {
        publicationsContainer.objects.move(session.startIndex, session.stopIndex);
        await publicationsContainer.save();
    }

    return res.status(200).send({ message: "Publications are swapped successfully" });
}));

// Switch routers
router.use("/pages", require("./containers/pages"));
router.use("/projects", require("./containers/projects"));
router.use("/vacancies", require("./containers/vacancies"));
router.use("/publications", require("./containers/publications"));

module.exports = router;