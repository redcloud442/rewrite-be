/*
  Warnings:

  - You are about to drop the `form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_field` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_form_response` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "form_schema";

-- DropForeignKey
ALTER TABLE "user_schema"."form_field" DROP CONSTRAINT "form_field_field_section_id_fkey";

-- DropForeignKey
ALTER TABLE "user_schema"."form_option" DROP CONSTRAINT "form_option_option_field_id_fkey";

-- DropForeignKey
ALTER TABLE "user_schema"."form_section" DROP CONSTRAINT "form_section_section_form_id_fkey";

-- DropForeignKey
ALTER TABLE "user_schema"."user_form_response" DROP CONSTRAINT "user_form_response_response_field_id_fkey";

-- DropForeignKey
ALTER TABLE "user_schema"."user_form_response" DROP CONSTRAINT "user_form_response_response_user_id_fkey";

-- DropTable
DROP TABLE "user_schema"."form";

-- DropTable
DROP TABLE "user_schema"."form_field";

-- DropTable
DROP TABLE "user_schema"."form_option";

-- DropTable
DROP TABLE "user_schema"."form_section";

-- DropTable
DROP TABLE "user_schema"."user_form_response";

-- CreateTable
CREATE TABLE "form_schema"."form" (
    "form_id" TEXT NOT NULL,
    "form_name" TEXT NOT NULL,
    "form_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_pkey" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "form_schema"."form_section" (
    "section_id" TEXT NOT NULL,
    "section_name" TEXT NOT NULL,
    "section_order" INTEGER NOT NULL,
    "section_form_id" TEXT NOT NULL,

    CONSTRAINT "form_section_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "form_schema"."form_field" (
    "field_id" TEXT NOT NULL,
    "field_label" TEXT NOT NULL,
    "field_type" TEXT NOT NULL,
    "field_order" INTEGER NOT NULL,
    "field_section_id" TEXT NOT NULL,

    CONSTRAINT "form_field_pkey" PRIMARY KEY ("field_id")
);

-- CreateTable
CREATE TABLE "form_schema"."form_option" (
    "option_id" TEXT NOT NULL,
    "option_label" TEXT NOT NULL,
    "option_field_id" TEXT NOT NULL,

    CONSTRAINT "form_option_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "form_schema"."user_form_response" (
    "response_id" TEXT NOT NULL,
    "response_user_id" TEXT NOT NULL,
    "response_field_id" TEXT NOT NULL,
    "response_value" TEXT NOT NULL,

    CONSTRAINT "user_form_response_pkey" PRIMARY KEY ("response_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_form_response_response_user_id_response_field_id_key" ON "form_schema"."user_form_response"("response_user_id", "response_field_id");

-- AddForeignKey
ALTER TABLE "form_schema"."form_section" ADD CONSTRAINT "form_section_section_form_id_fkey" FOREIGN KEY ("section_form_id") REFERENCES "form_schema"."form"("form_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_schema"."form_field" ADD CONSTRAINT "form_field_field_section_id_fkey" FOREIGN KEY ("field_section_id") REFERENCES "form_schema"."form_section"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_schema"."form_option" ADD CONSTRAINT "form_option_option_field_id_fkey" FOREIGN KEY ("option_field_id") REFERENCES "form_schema"."form_field"("field_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_schema"."user_form_response" ADD CONSTRAINT "user_form_response_response_user_id_fkey" FOREIGN KEY ("response_user_id") REFERENCES "user_schema"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_schema"."user_form_response" ADD CONSTRAINT "user_form_response_response_field_id_fkey" FOREIGN KEY ("response_field_id") REFERENCES "form_schema"."form_field"("field_id") ON DELETE RESTRICT ON UPDATE CASCADE;
