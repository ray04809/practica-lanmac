-- Add fill_blank exercises across all CEFR levels
-- Run in Supabase SQL Editor against web_site schema

INSERT INTO web_site.practice_exercises (cefr_level, skill, exercise_type, prompt, prompt_es, options, correct_answer, explanation, explanation_es, difficulty)
VALUES
-- A1 fill_blank (8 exercises)
('A1', 'grammar', 'fill_blank', 'I ___ a teacher.', 'Yo ___ un maestro.', '[]', 'am', 'The verb "to be" for "I" is "am".', 'El verbo "to be" para "I" es "am".', 0.3),
('A1', 'grammar', 'fill_blank', 'She ___ my sister.', 'Ella ___ mi hermana.', '[]', 'is', 'The verb "to be" for "she" is "is".', 'El verbo "to be" para "she" es "is".', 0.3),
('A1', 'grammar', 'fill_blank', 'They ___ from Mexico.', 'Ellos ___ de México.', '[]', 'are', 'The verb "to be" for "they" is "are".', 'El verbo "to be" para "they" es "are".', 0.3),
('A1', 'vocabulary', 'fill_blank', 'The color of the sky is ___.', 'El color del cielo es ___.', '[]', 'blue', 'The sky is blue on a clear day.', 'El cielo es azul en un día despejado.', 0.3),
('A1', 'vocabulary', 'fill_blank', 'A cat is a ___.', 'Un gato es una ___.', '[]', 'pet', 'A cat is a common pet or domestic animal.', 'Un gato es una mascota o animal doméstico.', 0.3),
('A1', 'grammar', 'fill_blank', 'I ___ not like coffee.', 'A mí no ___ gusta el café.', '[]', 'do', 'Use "do" with "I" for negative sentences.', 'Usa "do" con "I" en oraciones negativas.', 0.35),
('A1', 'vocabulary', 'fill_blank', 'We eat breakfast in the ___.', 'Desayunamos en la ___.', '[]', 'morning', 'Breakfast is the meal we eat in the morning.', 'El desayuno es la comida que tomamos en la mañana.', 0.3),
('A1', 'grammar', 'fill_blank', 'He ___ a car.', 'Él ___ un carro.', '[]', 'has', 'Use "has" with "he/she/it" for possession.', 'Usa "has" con "he/she/it" para posesión.', 0.35),

-- A2 fill_blank (8 exercises)
('A2', 'grammar', 'fill_blank', 'She ___ to school every day.', 'Ella ___ a la escuela todos los días.', '[]', 'goes', 'Third person singular uses "goes" in present simple.', 'La tercera persona singular usa "goes" en presente simple.', 0.4),
('A2', 'grammar', 'fill_blank', 'We ___ watching a movie last night.', 'Nosotros ___ viendo una película anoche.', '[]', 'were', 'Past continuous for "we" uses "were".', 'El pasado continuo para "we" usa "were".', 0.4),
('A2', 'vocabulary', 'fill_blank', 'The opposite of "hot" is ___.', 'Lo opuesto de "caliente" es ___.', '[]', 'cold', '"Hot" and "cold" are opposites describing temperature.', '"Hot" y "cold" son opuestos que describen temperatura.', 0.35),
('A2', 'vocabulary', 'fill_blank', 'A doctor works in a ___.', 'Un doctor trabaja en un ___.', '[]', 'hospital', 'Doctors typically work in hospitals.', 'Los doctores normalmente trabajan en hospitales.', 0.35),
('A2', 'grammar', 'fill_blank', 'I have ___ been to Paris.', 'Yo ___ he ido a París.', '[]', 'never', '"Never" expresses that something has not happened at any time.', '"Never" expresa que algo no ha sucedido en ningún momento.', 0.45),
('A2', 'grammar', 'fill_blank', 'They ___ playing soccer when it started to rain.', 'Ellos ___ jugando fútbol cuando empezó a llover.', '[]', 'were', 'Past continuous for "they" uses "were".', 'El pasado continuo para "they" usa "were".', 0.4),
('A2', 'vocabulary', 'fill_blank', 'You use a ___ to cut paper.', 'Usas unas ___ para cortar papel.', '[]', 'scissors', 'Scissors are used to cut paper and other materials.', 'Las tijeras se usan para cortar papel y otros materiales.', 0.4),
('A2', 'grammar', 'fill_blank', 'She ___ already finished her homework.', 'Ella ya ___ terminado su tarea.', '[]', 'has', 'Present perfect for "she" uses "has".', 'El presente perfecto para "she" usa "has".', 0.45),

-- B1 fill_blank (8 exercises)
('B1', 'grammar', 'fill_blank', 'If I ___ rich, I would travel the world.', 'Si yo ___ rico, viajaría por el mundo.', '[]', 'were', 'Second conditional uses "were" for all subjects.', 'El segundo condicional usa "were" para todos los sujetos.', 0.55),
('B1', 'grammar', 'fill_blank', 'By the time we arrived, the movie ___ already started.', 'Para cuando llegamos, la película ya ___ empezado.', '[]', 'had', 'Past perfect uses "had" + past participle.', 'El pasado perfecto usa "had" + participio pasado.', 0.55),
('B1', 'vocabulary', 'fill_blank', 'She made a ___ to study harder this semester.', 'Ella tomó la ___ de estudiar más duro este semestre.', '[]', 'decision', 'A "decision" is a choice or resolution to do something.', 'Una "decision" es una elección o resolución de hacer algo.', 0.5),
('B1', 'grammar', 'fill_blank', 'I wish I ___ speak French fluently.', 'Ojalá yo ___ hablar francés con fluidez.', '[]', 'could', '"Wish + could" expresses a desire for ability.', '"Wish + could" expresa un deseo de habilidad.', 0.55),
('B1', 'vocabulary', 'fill_blank', 'The manager asked us to ___ the meeting until Friday.', 'El gerente nos pidió ___ la reunión hasta el viernes.', '[]', 'postpone', '"Postpone" means to delay or reschedule to a later time.', '"Postpone" significa retrasar o reprogramar para más tarde.', 0.55),
('B1', 'grammar', 'fill_blank', 'She asked me ___ I had been to London before.', 'Ella me preguntó ___ yo había ido a Londres antes.', '[]', 'whether', '"Whether" introduces an indirect yes/no question.', '"Whether" introduce una pregunta indirecta de sí/no.', 0.6),
('B1', 'vocabulary', 'fill_blank', 'We need to find a ___ to this problem quickly.', 'Necesitamos encontrar una ___ a este problema rápido.', '[]', 'solution', 'A "solution" is an answer or way to fix a problem.', 'Una "solution" es una respuesta o forma de arreglar un problema.', 0.5),
('B1', 'grammar', 'fill_blank', 'The book ___ written by a famous author.', 'El libro ___ escrito por un autor famoso.', '[]', 'was', 'Passive voice in past simple uses "was/were" + past participle.', 'La voz pasiva en pasado simple usa "was/were" + participio pasado.', 0.5),

-- B2 fill_blank (8 exercises)
('B2', 'grammar', 'fill_blank', 'Had she studied harder, she ___ have passed the exam.', 'Si ella hubiera estudiado más, ___ haber aprobado el examen.', '[]', 'would', 'Third conditional uses "would have" + past participle.', 'El tercer condicional usa "would have" + participio pasado.', 0.65),
('B2', 'vocabulary', 'fill_blank', 'The CEO decided to ___ the company in a new direction.', 'El CEO decidió ___ la empresa en una nueva dirección.', '[]', 'steer', '"Steer" means to guide or direct something.', '"Steer" significa guiar o dirigir algo.', 0.65),
('B2', 'grammar', 'fill_blank', 'Not only ___ she finish on time, but she also exceeded expectations.', 'No solo ___ ella a tiempo, sino que superó las expectativas.', '[]', 'did', 'Inversion after "not only" requires auxiliary "did".', 'La inversión después de "not only" requiere el auxiliar "did".', 0.7),
('B2', 'vocabulary', 'fill_blank', 'The scientist made a ___ discovery that changed everything.', 'El científico hizo un descubrimiento ___ que cambió todo.', '[]', 'groundbreaking', '"Groundbreaking" means pioneering or revolutionary.', '"Groundbreaking" significa pionero o revolucionario.', 0.7),
('B2', 'grammar', 'fill_blank', 'By next year, I ___ have been working here for a decade.', 'Para el próximo año, yo ___ trabajando aquí por una década.', '[]', 'will', 'Future perfect uses "will have" + past participle.', 'El futuro perfecto usa "will have" + participio pasado.', 0.65),
('B2', 'vocabulary', 'fill_blank', 'The negotiations reached an ___ after hours of discussion.', 'Las negociaciones llegaron a un ___ después de horas de discusión.', '[]', 'impasse', 'An "impasse" is a deadlock or situation with no progress.', 'Un "impasse" es un punto muerto sin progreso.', 0.75),
('B2', 'grammar', 'fill_blank', 'It is essential that every employee ___ the new policy.', 'Es esencial que cada empleado ___ la nueva política.', '[]', 'follow', 'Subjunctive mood uses bare infinitive after "essential that".', 'El subjuntivo usa el infinitivo sin conjugar después de "essential that".', 0.7),
('B2', 'vocabulary', 'fill_blank', 'Her presentation was so ___ that the audience gave a standing ovation.', 'Su presentación fue tan ___ que el público le dio una ovación de pie.', '[]', 'compelling', '"Compelling" means powerfully convincing or captivating.', '"Compelling" significa poderosamente convincente o cautivador.', 0.7),

-- C1 fill_blank (8 exercises)
('C1', 'grammar', 'fill_blank', 'Hardly ___ he arrived when the meeting started.', 'Apenas ___ él llegado cuando la reunión empezó.', '[]', 'had', 'Inversion after "hardly" uses "had" for past perfect.', 'La inversión después de "hardly" usa "had" para pasado perfecto.', 0.8),
('C1', 'vocabulary', 'fill_blank', 'The policy was met with widespread ___ from the public.', 'La política fue recibida con ___ generalizada del público.', '[]', 'scrutiny', '"Scrutiny" means close, critical examination.', '"Scrutiny" significa examen detallado y crítico.', 0.8),
('C1', 'grammar', 'fill_blank', 'Were it not ___ his help, we would have failed.', 'De no ___ por su ayuda, habríamos fracasado.', '[]', 'for', '"Were it not for" is a formal conditional structure.', '"Were it not for" es una estructura condicional formal.', 0.85),
('C1', 'vocabulary', 'fill_blank', 'The diplomat''s speech was deliberately ___ to avoid offending anyone.', 'El discurso del diplomático fue deliberadamente ___ para no ofender a nadie.', '[]', 'ambiguous', '"Ambiguous" means open to multiple interpretations.', '"Ambiguous" significa abierto a múltiples interpretaciones.', 0.8),
('C1', 'grammar', 'fill_blank', 'Under no circumstances ___ this information be shared.', 'Bajo ninguna circunstancia ___ compartirse esta información.', '[]', 'should', 'Inversion after "under no circumstances" uses modal auxiliary.', 'La inversión después de "under no circumstances" usa auxiliar modal.', 0.85),
('C1', 'vocabulary', 'fill_blank', 'The new regulations will ___ significant changes in the industry.', 'Las nuevas regulaciones ___ cambios significativos en la industria.', '[]', 'entail', '"Entail" means to involve or make necessary.', '"Entail" significa involucrar o hacer necesario.', 0.8),
('C1', 'grammar', 'fill_blank', 'So complex was the problem ___ no one could solve it.', 'Tan complejo era el problema ___ nadie pudo resolverlo.', '[]', 'that', '"So + adjective + was... that" is an inverted emphasis structure.', '"So + adjetivo + was... that" es una estructura invertida de énfasis.', 0.85),
('C1', 'vocabulary', 'fill_blank', 'The critic''s ___ review destroyed the film''s box office prospects.', 'La reseña ___ del crítico destruyó las perspectivas de taquilla.', '[]', 'scathing', '"Scathing" means severely critical or harsh.', '"Scathing" significa severamente crítico o duro.', 0.85),

-- C2 fill_blank (4 exercises — C2 has few)
('C2', 'grammar', 'fill_blank', 'Little ___ they know what awaited them.', 'Poco ___ ellos lo que les esperaba.', '[]', 'did', 'Inversion after "little" with past simple uses "did".', 'La inversión después de "little" con pasado simple usa "did".', 0.9),
('C2', 'vocabulary', 'fill_blank', 'The author''s prose style is ___ for its lyrical quality.', 'El estilo del autor es ___ por su calidad lírica.', '[]', 'renowned', '"Renowned" means widely known and highly regarded.', '"Renowned" significa ampliamente conocido y altamente respetado.', 0.9),
('C2', 'grammar', 'fill_blank', 'At no point ___ the defendant shown any remorse.', 'En ningún momento ___ el acusado mostrado arrepentimiento.', '[]', 'has', 'Inversion after "at no point" uses present perfect auxiliary.', 'La inversión después de "at no point" usa el auxiliar del presente perfecto.', 0.9),
('C2', 'vocabulary', 'fill_blank', 'The treaty was designed to ___ long-standing territorial disputes.', 'El tratado fue diseñado para ___ disputas territoriales de larga data.', '[]', 'ameliorate', '"Ameliorate" means to make something better or improve.', '"Ameliorate" significa mejorar algo.', 0.95);
