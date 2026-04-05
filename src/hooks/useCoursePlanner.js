// src/hooks/useCoursePlanner.js
import { useState, useEffect, useMemo } from "react";

export const useCoursePlanner = (allCourses) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeHighlight, setActiveHighlight] = useState(null);

    // Load Data
    useEffect(() => {
        const saved = localStorage.getItem("krs_data");
        if (saved) setSelectedIds(JSON.parse(saved));
    }, []);

    // Save Data
    useEffect(() => {
        localStorage.setItem("krs_data", JSON.stringify(selectedIds));
    }, [selectedIds]);

    const selectedCourses = useMemo(
        () => allCourses.filter((c) => selectedIds.includes(c.kode_mata_kuliah)),
        [selectedIds, allCourses]
    );

    const totalSks = useMemo(
        () => selectedCourses.reduce((sum, c) => sum + c.sks, 0),
        [selectedCourses]
    );

    const isCourseLocked = (course) => {
        if (!course.kode_mata_kuliah_prasyarat || course.kode_mata_kuliah_prasyarat.length === 0) {
            return false;
        }
        return !course.kode_mata_kuliah_prasyarat.every((prereqKode) =>
            selectedIds.includes(prereqKode)
        );
    };

    const toggleCourse = (course) => {
        if (isCourseLocked(course)) return;

        const isSelected = selectedIds.includes(course.kode_mata_kuliah);
        setActiveHighlight(course.kode_mata_kuliah === activeHighlight ? null : course.kode_mata_kuliah);

        if (!isSelected) {
            let newSelection = new Set([...selectedIds]);
            const addWithPrereqs = (target) => {
                target.kode_mata_kuliah_prasyarat?.forEach((pId) => {
                    if (!newSelection.has(pId)) {
                        const prereq = allCourses.find((c) => c.kode_mata_kuliah === pId);
                        if (prereq) {
                            newSelection.add(pId);
                            addWithPrereqs(prereq);
                        }
                    }
                });
            };
            addWithPrereqs(course);
            newSelection.add(course.kode_mata_kuliah);
            setSelectedIds(Array.from(newSelection));
        } else {
            const isRequired = allCourses.some(
                (c) => selectedIds.includes(c.kode_mata_kuliah) && c.kode_mata_kuliah_prasyarat?.includes(course.kode_mata_kuliah)
            );
            if (isRequired) {
                alert("MK ini merupakan prasyarat untuk mata kuliah lain yang sudah Anda ambil.");
                return;
            }
            setSelectedIds(selectedIds.filter((id) => id !== course.kode));
        }
    };

    return { selectedIds, selectedCourses, totalSks, toggleCourse, activeHighlight, isCourseLocked };
};