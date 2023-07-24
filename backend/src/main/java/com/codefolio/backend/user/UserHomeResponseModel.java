package com.codefolio.backend.user;

import com.codefolio.backend.user.Projects.Projects;
import com.codefolio.backend.user.services.ServicesType;
import com.codefolio.backend.user.skills.SkillsType;
import com.codefolio.backend.user.workhistory.Work;

public record UserHomeResponseModel(
        String name,
        String email,
        String phone,
        String company,
        String location,
        String about,
        SkillsType[] skills,
        Projects[] projects,
        Work[] work,
        String role,
        String profession,
        ServicesType[] services
) {
}
