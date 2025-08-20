import React from "react";
import Modal from "./Modal";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Globe,
  Calendar,
  Building,
  FileText,
  Zap,
} from "lucide-react";

const ResumeDataModal = ({ isOpen, onClose, resumeData }) => {
  if (!resumeData || !resumeData.parsedData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Resume Data" size="lg">
        <div className="text-center py-8">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No parsed resume data available</p>
        </div>
      </Modal>
    );
  }

  const { parsedData } = resumeData;

  // Section component for consistent styling
  const Section = ({ icon: Icon, title, children, isEmpty = false }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
        <Icon size={20} className="text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {isEmpty ? (
        <p className="text-gray-500 italic">No data available</p>
      ) : (
        children
      )}
    </div>
  );

  // Info item component
  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 mb-2">
      <Icon size={16} className="text-gray-500 flex-shrink-0" />
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">{label}:</span>
        <span className="ml-2 text-sm text-gray-900">
          {value || "Not provided"}
        </span>
      </div>
    </div>
  );

  // Experience card component
  const ExperienceCard = ({ experience }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">
            {experience.title || "Position not specified"}
          </h4>
          <p className="text-primary-600 font-medium">
            {experience.company || "Company not specified"}
          </p>
        </div>
        {experience.duration && (
          <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
            {experience.duration}
          </span>
        )}
      </div>
      {experience.description && (
        <p className="text-sm text-gray-700 mb-2">{experience.description}</p>
      )}
      {experience.achievements && experience.achievements.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Key Achievements:
          </p>
          <ul className="list-disc list-inside space-y-1">
            {experience.achievements.map((achievement, index) => (
              <li key={index} className="text-sm text-gray-600">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Education card component
  const EducationCard = ({ education }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">
            {education.degree || "Degree not specified"}
          </h4>
          <p className="text-primary-600">
            {education.institution || "Institution not specified"}
          </p>
        </div>
        <div className="text-right text-sm text-gray-600">
          {education.year && <div>{education.year}</div>}
          {education.gpa && <div>GPA: {education.gpa}</div>}
        </div>
      </div>
    </div>
  );

  // Project card component
  const ProjectCard = ({ project }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 flex-1">
          {project.name || "Project name not specified"}
        </h4>
        {project.duration && (
          <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
            {project.duration}
          </span>
        )}
      </div>
      {project.description && (
        <p className="text-sm text-gray-700 mb-3">{project.description}</p>
      )}
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  // Certification card component
  const CertificationCard = ({ certification }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">
            {certification.name || "Certification not specified"}
          </h4>
          <p className="text-primary-600">
            {certification.issuer || "Issuer not specified"}
          </p>
        </div>
        {certification.date && (
          <span className="text-sm text-gray-600">{certification.date}</span>
        )}
      </div>
    </div>
  );

  // Language item component
  const LanguageItem = ({ language }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
      <span className="font-medium text-gray-900">
        {language.language || "Language not specified"}
      </span>
      <span className="text-sm text-primary-600 bg-primary-100 px-2 py-1 rounded">
        {language.proficiency || "Level not specified"}
      </span>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Parsed Resume Data"
      size="xl"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        {/* Personal Information */}
        <Section
          icon={User}
          title="Personal Information"
          isEmpty={
            !parsedData.personalInfo ||
            Object.values(parsedData.personalInfo).every((val) => !val)
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={User}
              label="Name"
              value={parsedData.personalInfo?.name}
            />
            <InfoItem
              icon={Mail}
              label="Email"
              value={parsedData.personalInfo?.email}
            />
            <InfoItem
              icon={Phone}
              label="Phone"
              value={parsedData.personalInfo?.phone}
            />
            <InfoItem
              icon={MapPin}
              label="Location"
              value={parsedData.personalInfo?.location}
            />
          </div>
        </Section>

        {/* Skills */}
        <Section
          icon={Zap}
          title="Skills"
          isEmpty={!parsedData.skills || parsedData.skills.length === 0}
        >
          <div className="flex flex-wrap gap-2">
            {parsedData.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>

        {/* Work Experience */}
        <Section
          icon={Briefcase}
          title="Work Experience"
          isEmpty={!parsedData.experience || parsedData.experience.length === 0}
        >
          {parsedData.experience?.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} />
          ))}
        </Section>

        {/* Education */}
        <Section
          icon={GraduationCap}
          title="Education"
          isEmpty={!parsedData.education || parsedData.education.length === 0}
        >
          {parsedData.education?.map((edu, index) => (
            <EducationCard key={index} education={edu} />
          ))}
        </Section>

        {/* Projects */}
        <Section
          icon={Code}
          title="Projects"
          isEmpty={!parsedData.projects || parsedData.projects.length === 0}
        >
          {parsedData.projects?.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </Section>

        {/* Certifications */}
        <Section
          icon={Award}
          title="Certifications"
          isEmpty={
            !parsedData.certifications || parsedData.certifications.length === 0
          }
        >
          {parsedData.certifications?.map((cert, index) => (
            <CertificationCard key={index} certification={cert} />
          ))}
        </Section>

        {/* Languages */}
        <Section
          icon={Globe}
          title="Languages"
          isEmpty={!parsedData.languages || parsedData.languages.length === 0}
        >
          {parsedData.languages?.map((lang, index) => (
            <LanguageItem key={index} language={lang} />
          ))}
        </Section>

        {/* Summary/Raw Text (if available) */}
        {parsedData.summary && (
          <Section icon={FileText} title="Resume Summary">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {parsedData.summary.length > 500
                  ? `${parsedData.summary.substring(0, 500)}...`
                  : parsedData.summary}
              </p>
            </div>
          </Section>
        )}
      </div>

      {/* Footer with metadata */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Parsed on:{" "}
            {new Date(
              resumeData.parsedAt || resumeData.uploadedAt
            ).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            Status:
            <span
              className={`ml-1 px-2 py-1 rounded-full text-xs ${
                resumeData.parseStatus === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {resumeData.parseStatus || "Unknown"}
            </span>
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ResumeDataModal;
