-- CreateTable
CREATE TABLE "VacancyAnalysis" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keySkills" JSONB NOT NULL,
    "risks" JSONB NOT NULL,
    "nextActions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vacancyId" TEXT NOT NULL,

    CONSTRAINT "VacancyAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VacancyAnalysis_vacancyId_key" ON "VacancyAnalysis"("vacancyId");

-- CreateIndex
CREATE INDEX "VacancyAnalysis_vacancyId_idx" ON "VacancyAnalysis"("vacancyId");

-- CreateIndex
CREATE INDEX "Vacancy_userId_idx" ON "Vacancy"("userId");

-- CreateIndex
CREATE INDEX "Vacancy_status_idx" ON "Vacancy"("status");

-- AddForeignKey
ALTER TABLE "VacancyAnalysis" ADD CONSTRAINT "VacancyAnalysis_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
